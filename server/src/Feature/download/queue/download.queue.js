import downloadQueue from "./download.bullMQ.js";
import { runningDownloads } from "./download.worker.js";
import Download from "../models/download.model.js";
import { getIO } from "../../../socket/socket.js";

// ============================================================
// HELPERS
// ============================================================

function emitStatus(download, status, extra = {}) {
  try {
    getIO()
      .to(download.userId.toString())
      .emit("download-status", {
        downloadId: download._id.toString(),
        status,
        progress: download.progress,
        ...extra,
      });
  } catch (error) {
    console.warn("[DownloadQueue] Socket error:", error.message);
  }
}

function createJobId(downloadId) {
  return `${downloadId}-${Date.now()}`;
}

// ============================================================
// ADD BULLMQ JOB
// ============================================================

async function addDownloadJob(download) {
  const jobId = createJobId(download._id.toString());

  const job = await downloadQueue.add(
    "download",
    {
      downloadId: download._id.toString(),
      userId: download.userId.toString(),
      url: download.url,
      platform: download.platform,

      quality: download.quality || "best",
      format: download.format || "mp4",
      mediaType: download.mediaType || "video",

      storageProvider: download.storageProvider || "device",
    },
    {
      jobId,
    },
  );

  await Download.findByIdAndUpdate(download._id, {
    jobId: job.id,
  });

  return job;
}

// ============================================================
// RETRY
// ============================================================

export async function retry(downloadId) {
  const download = await Download.findById(downloadId);

  if (!download) {
    throw new Error("Download not found.");
  }

  if (["queued", "downloading"].includes(download.status)) {
    throw new Error("Download is already in progress.");
  }

  const updatedDownload = await Download.findByIdAndUpdate(
    download._id,
    {
      status: "queued",
      progress: 0,
      error: "",
      downloadSpeed: "",
      eta: "",
      filePath: "",
      publicId: null,
      downloadedSize: 0,
    },
    {
      new: true,
    },
  );

  const job = await addDownloadJob(updatedDownload);

  emitStatus(updatedDownload, "queued", {
    progress: 0,
    downloadSpeed: "",
    eta: "",
    error: "",
  });

  console.log(`[DownloadQueue] Retry job added: ${job.id}`);

  return job;
}

// ============================================================
// PAUSE
// ============================================================

export async function pause(downloadId) {
  const download = await Download.findById(downloadId);

  if (!download) {
    throw new Error("Download not found.");
  }

  if (!["queued", "downloading"].includes(download.status)) {
    throw new Error("Only queued or downloading media can be paused.");
  }

  const running = runningDownloads.get(downloadId.toString());

  // ----------------------------------------------------------
  // Stop active yt-dlp
  // ----------------------------------------------------------

  if (running?.process) {
    try {
      if (process.platform === "win32") {
        // Kill yt-dlp + FFmpeg child processes.
        const killer = await import("child_process");

        const taskkill = killer.spawn("taskkill", [
          "/PID",
          running.process.pid.toString(),
          "/T",
          "/F",
        ]);

        await new Promise((resolve) => taskkill.on("close", resolve));
      } else {
        running.process.kill("SIGTERM");
      }
    } catch (error) {
      console.warn("[DownloadQueue] Failed to stop process:", error.message);
    }
  }

  // ----------------------------------------------------------
  // Mark paused
  // ----------------------------------------------------------

  const updated = await Download.findByIdAndUpdate(
    download._id,
    {
      status: "paused",
      downloadSpeed: "",
      eta: "",
    },
    {
      new: true,
    },
  );

  emitStatus(updated, "paused", {
    downloadSpeed: "",
    eta: "",
  });

  console.log(`[DownloadQueue] Paused: ${downloadId}`);
}

// ============================================================
// RESUME
// ============================================================

export async function resume(downloadId) {
  const download = await Download.findById(downloadId);

  if (!download) {
    throw new Error("Download not found.");
  }

  if (download.status !== "paused") {
    throw new Error("Only paused downloads can be resumed.");
  }

  const updated = await Download.findByIdAndUpdate(
    download._id,
    {
      status: "queued",
      downloadSpeed: "",
      eta: "",
      error: "",
    },
    {
      new: true,
    },
  );

  const job = await addDownloadJob(updated);

  emitStatus(updated, "queued", {
    downloadSpeed: "",
    eta: "",
  });

  console.log(`[DownloadQueue] Resume job added: ${job.id}`);

  return job;
}

// ============================================================
// CANCEL
// ============================================================

export async function cancel(downloadId) {
  const download = await Download.findById(downloadId);

  if (!download) {
    throw new Error("Download not found.");
  }

  if (download.status === "cancelled") {
    return;
  }

  // ----------------------------------------------------------
  // Mark cancelled FIRST
  // ----------------------------------------------------------

  await Download.findByIdAndUpdate(download._id, {
    status: "cancelled",
    downloadSpeed: "",
    eta: "",
  });

  // ----------------------------------------------------------
  // Stop active yt-dlp
  // ----------------------------------------------------------

  const running = runningDownloads.get(downloadId.toString());

  if (running?.process) {
    try {
      if (process.platform === "win32") {
        const killer = await import("child_process");

        const taskkill = killer.spawn("taskkill", [
          "/PID",
          running.process.pid.toString(),
          "/T",
          "/F",
        ]);

        await new Promise((resolve) => taskkill.on("close", resolve));
      } else {
        running.process.kill("SIGTERM");
      }
    } catch (error) {
      console.warn("[DownloadQueue] Failed to stop process:", error.message);
    }
  }

  // ----------------------------------------------------------
  // Remove waiting/delayed BullMQ job
  // ----------------------------------------------------------

  try {
    if (download.jobId) {
      const job = await downloadQueue.getJob(download.jobId);

      if (job) {
        const state = await job.getState();

        if (
          state === "waiting" ||
          state === "delayed" ||
          state === "prioritized"
        ) {
          await job.remove();

          console.log(`[DownloadQueue] Removed BullMQ job: ${job.id}`);
        }
      }
    }
  } catch (error) {
    console.warn("[DownloadQueue] Could not remove BullMQ job:", error.message);
  }

  emitStatus(download, "cancelled");

  console.log(`[DownloadQueue] Cancelled: ${downloadId}`);
}

// ============================================================
// EXPORT
// ============================================================

export default {
  retry,
  pause,
  resume,
  cancel,
};
