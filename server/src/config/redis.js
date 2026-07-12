import { createClient } from "redis";
import {REDIS_URL} from './env.js'
export const redisClient = createClient({
  url: REDIS_URL
});

redisClient.on("error", (err) => {
  console.log("Redis Error:", err);
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis Connected 👍");
  } catch (error) {
    console.log("Redis Connection Failed:", error);
  }
};

