import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/db/db.connection.js";
import { connectRedis } from "./src/config/redis.js";
import http from "http";
import { initSocket } from "./src/socket/socket.js";
import { checkFFmpeg } from "./src/Feature/Downloader/utils/ytDlp.js";

// ============================================================
// START SERVICES
// ============================================================

// Wait until MongoDB is connected
await connectDB();

// Test Redis connection once
await connectRedis();

// Check FFmpeg
await checkFFmpeg();

// Start BullMQ only when explicitly enabled
if (process.env.RUN_DOWNLOAD_WORKER === "true") {
  const { downloadQueue, wakeDownloadWorker } =
    await import("./src/Feature/download/queue/download.bullmq.js");

  const jobCounts = await downloadQueue.getJobCounts(
    "waiting",
    "active",
    "delayed",
    "prioritized",
  );

  const hasPendingJobs = Object.values(jobCounts).some((count) => count > 0);

  if (hasPendingJobs) {
    await wakeDownloadWorker();
  }
}

// ============================================================
// SERVER
// ============================================================

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log("🚀 Server Running on Port", PORT);
});
