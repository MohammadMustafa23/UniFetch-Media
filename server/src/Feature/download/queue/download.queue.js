import Download from "../models/download.model.js";
import path from "path";
import { downloadVideo } from "../../Downloader/utils/ytDlp.js";
import { createDownloadPath } from "../utils/downloadPath.js";
import { safeFileName } from "../utils/fileName.js";
import { getIO } from "../../../socket/socket.js";
import { findDownloadedFile } from "../utils/findDownloadedFile.js";
import { createNotification } from "../../notification/service/notification.service.js";
import { uploadToCloudinary } from "../../../cloud/cloudinary.js";
import { redisClient } from "../../../config/redis.js";
import User from "../../../models/user.model.js";
import { spawn } from "child_process";

import fs from "fs";
class DownloadQueue {
  constructor() {
    this.queue = [];
    this.isDownloading = false;

    this.processes = new Map();

    // Cancelled downloads
    this.cancelled = new Set();
  }

  // Add Download to Queue
  add(downloadId) {
    this.queue.push(downloadId);
    this.process();
  }

  async pause(downloadId) {
    const running = this.processes.get(downloadId.toString());

    if (!running) {
      throw new Error("Download is not currently running.");
    }

    // Get latest download
    const download = await Download.findById(downloadId);

    if (!download) {
      throw new Error("Download not found.");
    }

    // Allow pause only while downloading
    if (download.status !== "downloading") {
      throw new Error("Only downloading files can be paused.");
    }
    await new Promise((resolve) => {
      const killer = spawn("taskkill", [
        "/PID",
        running.process.pid.toString(),
        "/T",
        "/F",
      ]);
      killer.on("close", resolve);
    });

    // Update status
    download.status = "paused";
    await download.save();

    // Remove process from memory
    this.processes.delete(downloadId.toString());

    // Notify frontend
    getIO().to(download.userId.toString()).emit("download-status", {
      downloadId: download._id.toString(),
      status: "paused",
      progress: download.progress,
      downloadSpeed: "",
      eta: "",
    });
  }

  // Cancel/Delete Download
  async cancel(downloadId) {
    const running = this.processes.get(downloadId.toString());

    // Mark as cancelled
    this.cancelled.add(downloadId.toString());

    if (running) {
      // Kill entire process tree (yt-dlp + ffmpeg)
      await new Promise((resolve) => {
        const killer = spawn("taskkill", [
          "/PID",
          running.process.pid.toString(),
          "/T",
          "/F",
        ]);

        killer.on("close", resolve);
      });

      this.processes.delete(downloadId.toString());
    }

    // Remove from waiting queue
    this.queue = this.queue.filter(
      (id) => id.toString() !== downloadId.toString(),
    );

    // Update database
    await Download.findByIdAndUpdate(downloadId, {
      status: "cancelled",
      eta: "",
      downloadSpeed: "",
    });
  }
  async resume(downloadId) {
    const download = await Download.findById(downloadId);

    if (!download) {
      throw new Error("Download not found.");
    }

    if (download.status !== "paused") {
      throw new Error("Only paused downloads can be resumed.");
    }

    // Update status before adding to queue
    download.status = "queued";
    download.downloadSpeed = "";
    download.eta = "";
    await download.save();

    // Prevent duplicate queue entries
    const exists = this.queue.some(
      (id) => id.toString() === downloadId.toString(),
    );

    if (!exists) {
      this.queue.push(downloadId);
    }

    // Notify frontend
    getIO().to(download.userId.toString()).emit("download-status", {
      downloadId: download._id.toString(),
      status: "queued",
      progress: download.progress,
      downloadSpeed: "",
      eta: "",
    });
    // Start processing if idle
    this.process();
  }

  async updateProgress(downloadId, line) {
    try {
      line = line.trim();

      // Ignore empty lines
      if (!line) return;

      // Expected format:
      // 12.5%|123456.78|15
      const parts = line.split("|");

      if (parts.length < 3) return;

      const progress = Math.floor(parseFloat(parts[0].replace("%", "")));

      if (Number.isNaN(progress)) return;

      const speed = parts[1] || "";
      const eta = parts[2] || "";

      const download = await Download.findById(downloadId);

      if (!download) return;

      // Ignore duplicate/old updates
      if (progress < download.progress) return;

      const update = {
        progress,
        downloadSpeed: speed,
        eta,
      };

      await Download.findByIdAndUpdate(downloadId, update);

      const room = download.userId.toString();
      getIO()
        .to(room)
        .emit("download-progress", {
          downloadId: downloadId.toString(),
          ...update,
        });
    } catch (err) {
      console.error("Progress Error:", err);
    }
  }

  // Process Queue
  async process() {
    // Already downloading
    if (this.isDownloading) return;

    // Queue Empty
    if (this.queue.length === 0) return;

    this.isDownloading = true;
    const downloadId = this.queue.shift();

    try {
      // Get Latest Download Data
      const download = await Download.findById(downloadId);

      if (!download) {
        this.isDownloading = false;
        return this.process();
      }

      // Update Status
      await Download.findByIdAndUpdate(download._id, {
        status: "downloading",
        progress: 0,
      });

      // Create Download Folder
      const folder = createDownloadPath(download.userId, download.platform);

      // Safe File Name
      const fileName = `${safeFileName(download.title)}.%(ext)s`;

      // Output Path
      const outputPath = path.join(folder, fileName);

      // Start Download
      const ytProcess = downloadVideo({
        url: download.url,
        outputPath,
        quality: download.quality,
        format: download.format,
      });

      this.processes.set(download._id.toString(), {
        process: ytProcess,
        folder,
        outputPath,
      });

      // Read Progress
      let buffer = "";

      ytProcess.stdout.on("data", async (chunk) => {
        buffer += chunk.toString();

        const lines = buffer.split("\n");

        buffer = lines.pop();

        for (const line of lines) {
          await this.updateProgress(download._id, line);
        }
      });

      // Show yt-dlp errors
      ytProcess.stderr.on("data", (data) => {});

      await new Promise((resolve, reject) => {
        ytProcess.on("close", async (code, signal) => {
          // Download intentionally paused
          const latest = await Download.findById(download._id);
          if (latest?.status === "paused") {
            return resolve();
          }
          // Download intentionally cancelled
          if (this.cancelled.has(download._id.toString())) {
            return resolve();
          }
          if (code === 0) {
            return resolve();
          }
          reject(
            new Error(`yt-dlp exited with code ${code}, signal ${signal}`),
          );
        });

        ytProcess.on("error", reject);
      });

      const actualFile = findDownloadedFile(
        folder,
        safeFileName(download.title),
      );

      const latest = await Download.findById(download._id);
      if (latest?.status === "paused") {
        return;
      }

      if (this.cancelled.has(download._id.toString())) {
        return;
      }

      let cloudFile = null;

      if (download.storageProvider === "platform") {
        cloudFile = await uploadToCloudinary(actualFile, "downloads");
        // ===============================
        // Get actual file size
        // ===============================
        const stats = await fs.promises.stat(actualFile);

        // Save actual size in Download document
        download.fileSize = stats.size;
        download.downloadedSize = stats.size;

        // Increase user's used cloud storage
        await User.findByIdAndUpdate(download.userId, {
          $inc: {
            "cloudStorage.used": stats.size,
          },
        });

        await redisClient.del(`storage:${download.userId}`);

        // Save updated download
        await download.save();

        // Delete local temporary file
        await fs.promises.unlink(actualFile);
      }

      await Download.findByIdAndUpdate(download._id, {
        status: "completed",
        progress: 100,
        eta: "",
        filePath:
          download.storageProvider === "platform"
            ? cloudFile.secure_url
            : actualFile,
        publicId:
          download.storageProvider === "platform" ? cloudFile.public_id : null,
      });

      await User.findByIdAndUpdate(download.userId, {
        $inc: {
          "downloadLimit.used": 1,
        },
      });

      // ✅ Clear Downloads Cache
      await redisClient.del(`downloads:${download.userId}`);

      getIO().to(download.userId.toString()).emit("download-status", {
        downloadId: download._id.toString(),
        storageProvider: download.storageProvider,
        status: "completed",
        progress: 100,
        downloadSpeed: "",
        eta: "",
      });

      await createNotification({
        userId: download.userId,
        title: "Download Complete",
        message: `${download.title} has been downloaded successfully.`,
        type: "success",
        metadata: {
          downloadId: download._id,
        },
      });
    } catch (error) {
      console.error("Queue Error:", error);
      if (this.cancelled.has(downloadId.toString())) {
        this.cancelled.delete(downloadId.toString());
        return;
      }

      const existingDownload = await Download.findById(downloadId);
      if (existingDownload?.status === "paused") {
        return;
      }

      const download = await Download.findByIdAndUpdate(downloadId, {
        status: "failed",
        error: error.message,
      });

      if (!download) {
        return;
      }

      await createNotification({
        userId: download.userId,
        title: "Download Failed",
        message: `${download.title} couldn't be downloaded.`,
        type: "error",
        metadata: {
          downloadId: download._id,
        },
      });
    } finally {
      this.processes.delete(downloadId.toString());
      const latest = await Download.findById(downloadId);
      this.isDownloading = false;

      if (
        latest &&
        latest.status !== "paused" &&
        latest.status !== "cancelled"
      ) {
        this.process();
      }
    }
  }
}

export default new DownloadQueue();
