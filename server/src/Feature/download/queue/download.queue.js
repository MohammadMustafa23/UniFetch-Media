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

import fs from "fs";
class DownloadQueue {
  constructor() {
    this.queue = [];
    this.isDownloading = false;

    this.currentProcess = null;
    this.currentDownloadId = null;
    this.stopReason = null;
  }

  // Add Download to Queue
  add(downloadId) {
    this.queue.push(downloadId);
    console.log(downloadId);

    console.log(`📥 Added to Queue (${this.queue.length})`);
    this.process();
  }

  async pause(downloadId) {
    console.log("========== PAUSE ==========");
    console.log("Requested ID:", downloadId);
    console.log("Current ID:", this.currentDownloadId);
    console.log("Has Process:", !!this.currentProcess);
    console.log("Is Downloading:", this.isDownloading);

    if (
      !this.currentProcess ||
      this.currentDownloadId !== downloadId.toString()
    ) {
      throw new Error("This download is not currently running.");
    }

    // Tell process() this was intentional
    this.stopReason = "pause";

    const download = await Download.findByIdAndUpdate(
      downloadId,
      {
        status: "paused",
      },
      { new: true },
    );

    getIO().to(download.userId.toString()).emit("download-status", {
      downloadId: download._id.toString(),
      status: "paused",
      progress: download.progress,
      downloadSpeed: download.downloadSpeed,
      eta: download.eta,
    });

    console.log("🛑 Killing yt-dlp...");
    this.currentProcess.kill("SIGTERM");

    // ❌ DON'T clear these here.
    // process() -> finally will do it safely.

    console.log("⏸ Download Paused");
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

      console.log("📤 Progress:", update);

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

      console.log("Queue Storage:", download.storageProvider);

      if (!download) {
        this.isDownloading = false;
        return this.process();
      }

      console.log(`🚀 Starting Download: ${download.title}`);

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

      // Save Running Process
      this.currentProcess = ytProcess;
      this.currentDownloadId = download._id.toString();

      // Read Progress
      let buffer = "";

      ytProcess.stdout.on("data", async (chunk) => {
        buffer += chunk.toString();

        const lines = buffer.split("\n");

        buffer = lines.pop();

        for (const line of lines) {
          console.log(line);
          await this.updateProgress(download._id, line);
        }
      });

      // Show yt-dlp errors
      ytProcess.stderr.on("data", (data) => {
        console.log(data.toString());
      });

      // Wait Until Download Completes
      await new Promise((resolve, reject) => {
        ytProcess.on("close", (code) => {
          // Pause or Cancel was intentional
          if (this.stopReason === "pause") {
            this.stopReason = null;
            return resolve();
          }

          if (this.stopReason === "cancel") {
            this.stopReason = null;
            return resolve();
          }

          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`yt-dlp exited with code ${code}`));
          }
        });

        ytProcess.on("error", reject);
      });

      const actualFile = findDownloadedFile(
        folder,
        safeFileName(download.title),
      );

      let cloudFile = null;

      if (download.storageProvider === "platform") {
        console.log("☁ Uploading to Cloudinary...");
        cloudFile = await uploadToCloudinary(actualFile, "downloads");
        console.log("✅ Uploaded:", cloudFile.secure_url);

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
        console.log("🗑 Local file deleted.");
      }

      const latestDownload = await Download.findById(download._id);

      if (latestDownload.status === "paused") {
        console.log("⏸ Download paused.");
        return;
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

      // ✅ Clear Downloads Cache
      await redisClient.del(`downloads:${download.userId}`);

      console.log("📤 Emitting download-status:", download.userId.toString());

      getIO().to(download.userId.toString()).emit("download-status", {
        downloadId: download._id.toString(),
        storageProvider: download.storageProvider, // ⭐ IMPORTANT
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

      console.log(`✅ Completed: ${download.title}`);
    } catch (error) {
      console.error("Queue Error:", error);

      const download = await Download.findByIdAndUpdate(downloadId, {
        status: "failed",
        error: error.message,
      });

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
      this.currentProcess = null;
      this.currentDownloadId = null;
      this.isDownloading = false;
      // Start Next Download
      this.process();
    }
  }
}

export default new DownloadQueue();
