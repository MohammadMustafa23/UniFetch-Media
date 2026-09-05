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

    removeOnComplete: {
      age: 3600,
      count: 1000,
    },

    removeOnFail: {
      age: 86400,
      count: 2000,
    },
  },
});

export default downloadQueue;
