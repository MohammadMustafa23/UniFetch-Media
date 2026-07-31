import {
  getUserPreferences,
  updateUserPreferences,
} from "../service/preferences.service.js";
import { redisClient } from "../../../config/redis.js";

export async function getPreferences(req, res) {
  try {
    const userId = req.user._id;
    const cacheKey = `preferences:${userId}`;

    // ==========================
    // Check Redis Cache
    // ==========================
    const cachedPreferences = await redisClient.get(cacheKey);

    if (cachedPreferences) {
      return res.status(200).json({
        success: true,
        message: "Preferences fetched successfully.",
        data: cachedPreferences,
      });
    }

    // ==========================
    // Fetch from MongoDB
    // ==========================
    const preferences = await getUserPreferences(userId);

    // ==========================
    // Save to Redis (1 Hour)
    // ==========================
    await redisClient.set(cacheKey, preferences, {
      ex: 60 * 60, // 1 Hour
    });

    return res.status(200).json({
      success: true,
      message: "Preferences fetched successfully.",
      data: preferences,
    });
  } catch (error) {
    console.error("Get Preferences Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// PATCH /api/preferences
export async function updatePreferences(req, res) {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No preferences provided to update.",
      });
    }

    // Allowed preference sections
    const allowedFields = ["autodownload", "storage", "quality"];
    const requestFields = Object.keys(req.body);

    const invalidFields = requestFields.filter(
      (field) => !allowedFields.includes(field.toLowerCase())
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid field(s): ${invalidFields.join(", ")}`,
      });
    }

    const preferences = await updateUserPreferences(
      req.user._id,
      req.body
    );

    // ==========================
    // Clear Redis Cache
    // ==========================
    await redisClient.del(`preferences:${req.user._id}`);

    return res.status(200).json({
      success: true,
      message: "Preferences updated successfully.",
      data: preferences,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update preferences.",
    });
  }
}