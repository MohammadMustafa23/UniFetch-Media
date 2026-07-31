import Download from "../models/download.model.js";
import { redisClient } from "../../../config/redis.js";

export async function getDownloads(req, res) {
  try {
    const userId = req.user._id;
    const cacheKey = `downloads:${userId}`;

    // ==========================
    // Check Redis Cache
    // ==========================
    const cachedDownloads = await redisClient.get(cacheKey);

    if (cachedDownloads) {
      return res.status(200).json({
        success: true,
        message: "Downloads fetched successfully.",
        data: cachedDownloads,
      });
    }

    // ==========================
    // Fetch from MongoDB
    // ==========================
    const downloads = await Download.find({
      userId,
      status: "completed",
    })
      .sort({ createdAt: -1 })
      .lean();

    // ==========================
    // Save to Redis (1 Minute)
    // ==========================
    await redisClient.set(cacheKey, downloads, {
      ex: 60,
    });

    return res.status(200).json({
      success: true,
      message: "Downloads fetched successfully.",
      data: downloads,
    });
  } catch (error) {
    console.error("Get Downloads Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch downloads.",
    });
  }
}
