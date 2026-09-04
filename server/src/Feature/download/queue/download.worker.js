import IORedis from "ioredis";
import { Worker, UnrecoverableError } from "bullmq";

import path from "path";
import fs from "fs";

import { REDIS_URL } from "../../../config/env.js";

import Download from "../models/download.model.js";
import User from "../../../models/user.model.js";

import { getVideoInfo, downloadVideo } from "../../Downloader/utils/ytDlp.js";

import { createDownloadPath } from "../utils/downloadPath.js";
import { safeFileName } from "../utils/fileName.js";
import { findDownloadedFile } from "../utils/findDownloadedFile.js";

import { uploadToCloudinary } from "../../../cloud/cloudinary.js";
import { redisClient } from "../../../config/redis.js";

import { getIO } from "../../../socket/socket.js";

import { createNotification } from "../../notification/service/notification.service.js";

import { DOWNLOAD_QUEUE_NAME } from "./download.bullMQ.js";

// ============================================================
// REDIS CONNECTION
// ============================================================

const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

connection.on("connect", () => {
  console.log("[DownloadWorker] Redis connected");
});

connection.on("error", (error) => {
  console.error("[DownloadWorker] Redis error:", error.message);
});

// ============================================================
// CONFIG
// ============================================================

const MAX_DURATION_SECONDS = 180;

// Keep this at 1 for the first architecture test.
// Increase later after performance testing.
const WORKER_CONCURRENCY = 1;

// ============================================================
// RUNNING DOWNLOADS
// ============================================================

// downloadId -> {
//   process,
//   folder,
//   outputPath
// }

export const runningDownloads = new Map();

// ============================================================
// SOCKET HELPERS
// ============================================================

function emitDownloadStatus(download, data = {}) {
  try {
    getIO()
      .to(download.userId.toString())
      .emit("download-status", {
        downloadId: download._id.toString(),
        ...data,
      });
  } catch (error) {
    console.warn("[DownloadWorker] Socket status failed:", error.message);
  }
}

function emitDownloadProgress(download, data = {}) {
  try {
    getIO()
      .to(download.userId.toString())
      .emit("download-progress", {
        downloadId: download._id.toString(),
        ...data,
      });
  } catch (error) {
    console.warn("[DownloadWorker] Socket progress failed:", error.message);
  }
}

// ============================================================
// PROGRESS
// ============================================================

async function updateProgress(downloadId, line) {
  try {
    line = line.trim();

    if (!line) return;

    const parts = line.split("|");

    if (parts.length < 3) return;

    const progress = Math.floor(parseFloat(parts[0].replace("%", "")));

    if (Number.isNaN(progress)) return;

    const speed = parts[1] || "";
    const eta = parts[2] || "";

    const download = await Download.findById(downloadId)
      .select("_id userId progress status")
      .lean();

    if (!download) return;

    // Do not update progress after completion/failure/cancel.
    if (download.status !== "downloading") {
      return;
    }

    // Ignore old/out-of-order progress updates.
    if (progress < download.progress) {
      return;
    }

    const update = {
      progress,
      downloadSpeed: speed,
      eta,
    };

    await Download.findByIdAndUpdate(downloadId, update);

    emitDownloadProgress(download, update);
  } catch (error) {
    console.warn("[DownloadWorker] Progress update failed:", error.message);
  }
}

// ============================================================
// FAILURE HANDLER
// ============================================================

async function failDownload(downloadId, error) {
  try {
    const message = error?.message || "Download failed.";

    const download = await Download.findByIdAndUpdate(
      downloadId,
      {
        status: "failed",
        error: message,
        downloadSpeed: "",
        eta: "",
      },
      {
        new: true,
      },
    );

    if (!download) return;

    emitDownloadStatus(download, {
      status: "failed",
      progress: download.progress,
      downloadSpeed: "",
      eta: "",
      error: message,
    });

    // Notification failure must NOT make the download job fail again.
    try {
      await createNotification({
        userId: download.userId,
        title: "Download Failed",
        message: `${download.title || "Media"} couldn't be downloaded.`,
        type: "error",
        metadata: {
          downloadId: download._id,
        },
      });
    } catch (notificationError) {
      console.warn(
        "[DownloadWorker] Failure notification failed:",
        notificationError.message,
      );
    }
  } catch (failureError) {
    console.error("[DownloadWorker] failDownload error:", failureError.message);
  }
}

// ============================================================
// WORKER
// ============================================================

const downloadWorker = new Worker(
  DOWNLOAD_QUEUE_NAME,

  async (job) => {
    const { downloadId } = job.data;

    console.log(`[DownloadWorker] Starting job ${job.id} → ${downloadId}`);

    let download = null;

    try {
      // ========================================================
      // 1. LOAD DOWNLOAD
      // ========================================================

      download = await Download.findById(downloadId);

      if (!download) {
        throw new UnrecoverableError("Download record not found.");
      }

      // ========================================================
      // 2. CANCELLED CHECK
      // ========================================================

      if (download.status === "cancelled") {
        console.log(`[DownloadWorker] ${downloadId} already cancelled.`);

        return {
          skipped: true,
          reason: "cancelled",
        };
      }

      // ========================================================
      // 3. GET MEDIA INFORMATION
      // ========================================================

      console.log(
        `[DownloadWorker] Extracting media information: ${downloadId}`,
      );

      const video = await getVideoInfo(download.url);

      if (!video) {
        throw new Error("Unable to fetch media information.");
      }

      // ========================================================
      // 4. 3-MINUTE LIMIT
      // ========================================================

      const duration = Number(video.duration || 0);

      console.log(`[DownloadWorker] Duration: ${duration}s`);

      if (duration > MAX_DURATION_SECONDS) {
        throw new UnrecoverableError(
          "Videos longer than 3 minutes are not supported.",
        );
      }

      // ========================================================
      // 5. UPDATE MEDIA INFORMATION
      // ========================================================

      const videoId = video.id || download.videoId || null;

      const title = video.title || download.title || "Downloaded Media";

      const thumbnail = video.thumbnail || download.thumbnail || "";

      const fileSize =
        video.filesize ?? video.filesize_approx ?? download.fileSize ?? 0;

      await Download.findByIdAndUpdate(download._id, {
        videoId,
        title,
        thumbnail,
        duration,
        fileSize,
      });

      // Keep local object in sync.
      download.videoId = videoId;
      download.title = title;
      download.thumbnail = thumbnail;
      download.duration = duration;
      download.fileSize = fileSize;

      // ========================================================
      // 6. CLOUD STORAGE CHECK
      // ========================================================

      if (download.storageProvider === "platform") {
        const user = await User.findById(download.userId)
          .select("cloudStorage")
          .lean();

        if (!user) {
          throw new UnrecoverableError("User not found.");
        }

        const cloudStorage = user.cloudStorage || {
          used: 0,
          limit: 0,
        };

        const remaining = cloudStorage.limit - cloudStorage.used;

        if (fileSize && fileSize > remaining) {
          throw new UnrecoverableError("Cloud storage limit exceeded.");
        }
      }

      // ========================================================
      // 7. STATUS → DOWNLOADING
      // ========================================================

      await Download.findByIdAndUpdate(download._id, {
        status: "downloading",
        progress: 0,
        downloadedSize: 0,
        downloadSpeed: "",
        eta: "",
        error: "",
      });

      emitDownloadStatus(download, {
        status: "downloading",
        progress: 0,
        downloadSpeed: "",
        eta: "",
      });

      // ========================================================
      // 8. CREATE DOWNLOAD PATH
      // ========================================================

      const folder = createDownloadPath(download.userId, download.platform);

      const fileName = `${safeFileName(title)}.%(ext)s`;

      const outputPath = path.join(folder, fileName);

      // ========================================================
      // 9. START YT-DLP
      // ========================================================

      const ytProcess = downloadVideo({
        url: download.url,
        outputPath,
        mediaType: download.mediaType,
        quality: download.quality,
        format: download.format,
      });

      runningDownloads.set(download._id.toString(), {
        process: ytProcess,
        folder,
        outputPath,
      });

      console.log(`[DownloadWorker] yt-dlp started: ${downloadId}`);

      // ========================================================
      // 10. PROGRESS
      // ========================================================

      let buffer = "";

      ytProcess.stdout.on("data", (chunk) => {
        buffer += chunk.toString();

        const lines = buffer.split("\n");

        buffer = lines.pop() || "";

        for (const line of lines) {
          // Do not await here.
          // yt-dlp stdout must remain flowing.
          updateProgress(download._id, line).catch((error) => {
            console.warn("[DownloadWorker] Progress error:", error.message);
          });
        }
      });

      // ========================================================
      // 11. STDERR
      // ========================================================

      let stderrBuffer = "";

      ytProcess.stderr.on("data", (chunk) => {
        stderrBuffer += chunk.toString();

        // Keep memory bounded.
        if (stderrBuffer.length > 10000) {
          stderrBuffer = stderrBuffer.slice(-10000);
        }
      });

      // ========================================================
      // 12. WAIT FOR YT-DLP
      // ========================================================

      await new Promise((resolve, reject) => {
        let settled = false;

        const finishResolve = () => {
          if (settled) return;

          settled = true;
          resolve();
        };

        const finishReject = (error) => {
          if (settled) return;

          settled = true;
          reject(error);
        };

        ytProcess.on("close", async (code, signal) => {
          try {
            const latest = await Download.findById(download._id);

            // ------------------------------------------------
            // Paused / Cancelled externally
            // ------------------------------------------------

            if (latest?.status === "paused" || latest?.status === "cancelled") {
              return finishResolve();
            }

            // ------------------------------------------------
            // Successful process
            // ------------------------------------------------

            if (code === 0) {
              return finishResolve();
            }

            // ------------------------------------------------
            // Failed process
            // ------------------------------------------------

            const details = stderrBuffer.trim().slice(-2000);

            const message =
              `yt-dlp exited with code ${code}` +
              `${signal ? `, signal ${signal}` : ""}` +
              `${details ? `: ${details}` : ""}`;

            finishReject(new Error(message));
          } catch (error) {
            finishReject(error);
          }
        });

        ytProcess.on("error", finishReject);
      });

      // ========================================================
      // 13. CHECK DOWNLOAD STATE
      // ========================================================

      const latestDownload = await Download.findById(download._id);

      if (
        latestDownload?.status === "paused" ||
        latestDownload?.status === "cancelled"
      ) {
        console.log(
          `[DownloadWorker] Job ${downloadId} stopped: ${latestDownload.status}`,
        );

        return {
          skipped: true,
          reason: latestDownload.status,
        };
      }

      // ========================================================
      // 14. FIND ACTUAL FILE
      // ========================================================

      const actualFile = findDownloadedFile(folder, safeFileName(title));

      if (!actualFile) {
        throw new Error("Downloaded file could not be found.");
      }

      // ========================================================
      // 15. ACTUAL FILE SIZE
      // ========================================================

      const stats = await fs.promises.stat(actualFile);

      const actualFileSize = stats.size;

      console.log(`[DownloadWorker] File size: ${actualFileSize} bytes`);

      // ========================================================
      // 16. SECOND CLOUD STORAGE CHECK
      // ========================================================
      //
      // Metadata filesize can be approximate.
      // Check the real downloaded size before upload.
      // ========================================================

      if (download.storageProvider === "platform") {
        const user = await User.findById(download.userId)
          .select("cloudStorage")
          .lean();

        if (!user) {
          throw new UnrecoverableError("User not found.");
        }

        const cloudStorage = user.cloudStorage || {
          used: 0,
          limit: 0,
        };

        const remaining = cloudStorage.limit - cloudStorage.used;

        if (actualFileSize > remaining) {
          throw new UnrecoverableError("Cloud storage limit exceeded.");
        }
      }

      // ========================================================
      // 17. CLOUDINARY
      // ========================================================

      let cloudFile = null;

      if (download.storageProvider === "platform") {
        console.log(`[DownloadWorker] Uploading to Cloudinary: ${downloadId}`);

        cloudFile = await uploadToCloudinary(actualFile, "downloads");

        if (!cloudFile) {
          throw new Error("Cloudinary upload failed.");
        }

        await User.findByIdAndUpdate(download.userId, {
          $inc: {
            "cloudStorage.used": actualFileSize,
          },
        });

        await redisClient.del(`storage:${download.userId}`);

        // Remove local copy only after
        // successful Cloudinary upload.
        await fs.promises.unlink(actualFile);
      }

      // ========================================================
      // 18. COMPLETED
      // ========================================================

      const filePath =
        download.storageProvider === "platform"
          ? cloudFile.secure_url
          : actualFile;

      const publicId =
        download.storageProvider === "platform" ? cloudFile.public_id : null;

      const completedDownload = await Download.findByIdAndUpdate(
        download._id,
        {
          status: "completed",
          progress: 100,
          fileSize: actualFileSize,
          downloadedSize: actualFileSize,
          downloadSpeed: "",
          eta: "",
          filePath,
          publicId,
          error: "",
        },
        {
          new: true,
        },
      );

      // ========================================================
      // 19. DOWNLOAD LIMIT
      // ========================================================

      await User.findByIdAndUpdate(download.userId, {
        $inc: {
          "downloadLimit.used": 1,
        },
      });

      // ========================================================
      // 20. CACHE INVALIDATION
      // ========================================================

      await redisClient.del(`downloads:${download.userId}`);

      // ========================================================
      // 21. SOCKET → COMPLETED
      // ========================================================

      emitDownloadStatus(completedDownload || download, {
        storageProvider: download.storageProvider,
        status: "completed",
        progress: 100,
        downloadSpeed: "",
        eta: "",
      });

      // ========================================================
      // 22. NOTIFICATION
      // ========================================================
      //
      // Notification failure must NOT turn an already
      // completed download into a BullMQ failed job.
      // ========================================================

      try {
        await createNotification({
          userId: download.userId,
          title: "Download Complete",
          message: `${title} has been downloaded successfully.`,
          type: "success",
          metadata: {
            downloadId: download._id,
          },
        });
      } catch (notificationError) {
        console.warn(
          "[DownloadWorker] Completion notification failed:",
          notificationError.message,
        );
      }

      console.log(`[DownloadWorker] Completed job ${job.id}`);

      // ========================================================
      // 23. RETURN
      // ========================================================

      return {
        success: true,
        downloadId: downloadId.toString(),
      };
    } catch (error) {
      // --------------------------------------------------------
      // IMPORTANT:
      // We do NOT update DB to failed here.
      //
      // BullMQ controls retry behavior.
      // The "failed" event below handles the final DB state.
      // --------------------------------------------------------

      console.error(`[DownloadWorker] Job error ${job.id}:`, error.message);

      throw error;
    } finally {
      // ========================================================
      // CLEAN RUNNING PROCESS
      // ========================================================

      runningDownloads.delete(downloadId.toString());
    }
  },

  {
    connection,
    concurrency: WORKER_CONCURRENCY,
  },
);

// ============================================================
// COMPLETED EVENT
// ============================================================

downloadWorker.on("completed", (job) => {
  console.log(`[DownloadWorker] Job completed: ${job.id}`);
});

// ============================================================
// FAILED EVENT
// ============================================================

downloadWorker.on("failed", async (job, error) => {
  if (!job) return;

  console.error(`[DownloadWorker] Job failed: ${job.id}`, error.message);

  try {
    const downloadId = job.data?.downloadId;

    if (!downloadId) return;

    // ========================================================
    // DO NOT MARK FAILED IF BULLMQ WILL RETRY
    // ========================================================

    const attempts = job.opts.attempts ?? 1;

    const isFinalAttempt = job.attemptsMade >= attempts;

    const isUnrecoverable =
      error instanceof UnrecoverableError ||
      error?.name === "UnrecoverableError";

    if (!isFinalAttempt && !isUnrecoverable) {
      console.log(
        `[DownloadWorker] Retry scheduled for ${job.id} ` +
          `(${job.attemptsMade}/${attempts})`,
      );

      return;
    }

    // ========================================================
    // FINAL FAILURE
    // ========================================================

    await failDownload(downloadId, error);
  } catch (failureError) {
    console.error(
      "[DownloadWorker] Failed to update failed job:",
      failureError.message,
    );
  }
});

// ============================================================
// WORKER ERROR
// ============================================================

downloadWorker.on("error", (error) => {
  console.error("[DownloadWorker] Worker error:", error.message);
});

// ============================================================
// START
// ============================================================

console.log(`[DownloadWorker] Started: ${DOWNLOAD_QUEUE_NAME}`);

export default downloadWorker;
