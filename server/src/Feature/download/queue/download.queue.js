import Download from "../models/download.model.js";
import path from "path";
import { downloadVideo } from "../../Downloader/utils/ytDlp.js";
import { createDownloadPath } from "../utils/downloadPath.js";
import { safeFileName } from "../utils/fileName.js";
import { getIO } from "../../../socket/socket.js";
import { findDownloadedFile } from "../utils/findDownloadedFile.js";
import { createNotification } from "../../notification/service/notification.service.js";
import fs from "fs";
class DownloadQueue {
  constructor() {
    this.queue = [];
    this.isDownloading = false;

    this.currentProcess = null;
    this.currentDownloadId = null;
  }

  // Add Download to Queue
  add(downloadId) {
    this.queue.push(downloadId);
    console.log(`📥 Added to Queue (${this.queue.length})`);
    this.process();
  }

  async pause(downloadId) {
    if (
      !this.currentProcess ||
      this.currentDownloadId !== downloadId.toString()
    ) {
      throw new Error("This download is not currently running.");
    }
    this.currentProcess.kill("SIGSTOP");
    await Download.findByIdAndUpdate(downloadId, {
      status: "paused",
    });
    console.log("⏸ Download Paused");
  }

  async resume(downloadId) {
    if (
      !this.currentProcess ||
      this.currentDownloadId !== downloadId.toString()
    ) {
      throw new Error("This download is not paused.");
    }

    this.currentProcess.kill("SIGCONT");

    await Download.findByIdAndUpdate(downloadId, {
      status: "downloading",
    });

    console.log("▶️ Download Resumed");
  }

  async cancel(downloadId) {
    // Remove from queue if waiting
    this.queue = this.queue.filter(
      (id) => id.toString() !== downloadId.toString(),
    );

    await Download.findByIdAndDelete(downloadId);

    if (!download) {
      throw new Error("Download not found.");
    }

    // If this download is currently running
    if (
      this.currentProcess &&
      this.currentDownloadId === downloadId.toString()
    ) {
      this.currentProcess.kill("SIGTERM");

      this.currentProcess = null;
      this.currentDownloadId = null;
      this.isDownloading = false;
    }

    // Delete downloaded/partial file if it exists
    if (download.filePath && fs.existsSync(download.filePath)) {
      fs.unlinkSync(download.filePath);
    }

    await Download.findByIdAndDelete(downloadId);

    // Continue with next queued download
    this.process();

    console.log("🗑 Download deleted");
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

      await Download.findByIdAndUpdate(download._id, {
        status: "completed",
        progress: 100,
        eta: "",
        filePath: actualFile || "",
      });

      console.log(
        "📤 Emitting download-completed to:",
        download.userId.toString(),
      );

      getIO().to(download.userId.toString()).emit("download-completed", {
        downloadId: download._id.toString(),
        storageProvider: download.storageProvider,
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

      await Download.findByIdAndUpdate(downloadId, {
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
