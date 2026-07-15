import Download from "../models/download.model.js";
import path from "path";
import { downloadVideo } from "../../Downloader/utils/ytDlp.js";
import { createDownloadPath } from "../utils/downloadPath.js";
import { safeFileName } from "../utils/fileName.js";
import { findDownloadedFile } from "../utils/findDownloadedFile.js";
class DownloadQueue {
  constructor() {
    this.queue = [];
    this.isDownloading = false;
  }

  // Add Download to Queue
  add(downloadId) {
    this.queue.push(downloadId);
    console.log(`📥 Added to Queue (${this.queue.length})`);
    this.process();
  }

  async updateProgress(downloadId, line) {
    try {
      if (!line.includes("[download]")) return;

      const progressMatch = line.match(/(\d+(?:\.\d+)?)%/);
      const speedMatch = line.match(/at\s+([^\s]+)/);
      const etaMatch = line.match(/ETA\s+([0-9:]+)/);

      const progress = progressMatch
        ? Math.floor(Number(progressMatch[1]))
        : undefined;

      const speed = speedMatch ? speedMatch[1] : "";

      const eta = etaMatch ? etaMatch[1] : "";

      const update = {};

      if (progress !== undefined) update.progress = progress;

      if (speed) update.downloadSpeed = speed;

      if (eta) update.eta = eta;

      if (Object.keys(update).length > 0) {
        await Download.findByIdAndUpdate(downloadId, update);
      }
    } catch (error) {
      console.error("Progress Parse Error:", error.message);
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

      // Save Running Process (for future cancel feature)
      this.currentProcess = ytProcess;

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

      console.log(`✅ Completed: ${download.title}`);
    } catch (error) {
      console.error("Queue Error:", error);

      await Download.findByIdAndUpdate(downloadId, {
        status: "failed",
        error: error.message,
      });
    } finally {
      this.currentProcess = null;
      this.isDownloading = false;

      // Start Next Download
      this.process();
    }
  }
}

export default new DownloadQueue();
