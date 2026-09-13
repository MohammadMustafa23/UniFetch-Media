import IORedis from "ioredis";
import { Queue } from "bullmq";
import { REDIS_URL } from "../../../config/env.js";

export const DOWNLOAD_QUEUE_NAME = "media-downloads";

const bullRedis = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: 1,
});

bullRedis.on("connect", () => {
  console.log("[BullMQ] Redis connected");
});

bullRedis.on("error", (error) => {
  console.error("[BullMQ] Redis error:", error.message);
});

export const downloadQueue = new Queue(DOWNLOAD_QUEUE_NAME, {
  connection: bullRedis,

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 3000,
    },

    removeOnComplete: true,
    removeOnFail: true,
  },
});

// ============================================================
// ON-DEMAND WORKER START
// ============================================================

export async function wakeDownloadWorker() {
  if (process.env.RUN_DOWNLOAD_WORKER !== "true") {
    return;
  }

  const { resumeDownloadWorker } = await import("./download.worker.js");

  await resumeDownloadWorker();
}

// Start/resume the worker only after a new job is added.
const originalAdd = downloadQueue.add.bind(downloadQueue);

downloadQueue.add = async (...args) => {
  const job = await originalAdd(...args);

  await wakeDownloadWorker();

  return job;
};

export default downloadQueue;
