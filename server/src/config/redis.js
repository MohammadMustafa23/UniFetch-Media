import { Redis } from "@upstash/redis";
import { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } from "./env.js";

export const redisClient = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

export const connectRedis = async () => {
  try {
    // Test the connection
    await redisClient.ping();

    console.log("✅ Upstash Redis Connected");
    return true;
  } catch (error) {
    console.error("❌ Upstash Redis Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
};