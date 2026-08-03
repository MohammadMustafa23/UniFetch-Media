import History from "../models/history.model.js";
import Preference from "../../Preferences/models/preferences.model.js";
import Download from "../../download/\/models/download.model.js";
import { getVideoInfo } from "../../Downloader/utils/ytDlp.js";
import detectPlatform from "../../Downloader/utils/detectPlatform.js";
import downloadQueue from "../../download/queue/download.queue.js";
import { redisClient } from "../../../config/redis.js";

export const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const history = await History.findOne({
      _id: id,
      userId,
    });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "History not found.",
      });
    }

    // Toggle favorite
    history.favorite = !history.favorite;
    await history.save();

    // ==========================
    // Clear Redis Cache
    // ==========================
    await Promise.all([
      redisClient.del(`history:${userId}`),
      redisClient.del(`favorites:${userId}`),
    ]);

    return res.status(200).json({
      success: true,
      favorite: history.favorite,
      message: history.favorite
        ? "Added to favorites."
        : "Removed from favorites.",
    });
  } catch (error) {
    console.error("Toggle Favorite:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update favorite.",
    });
  }
};

export async function deleteHistory(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "History ID is required.",
      });
    }

    const history = await History.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "History not found.",
      });
    }

    await history.deleteOne();

    // ==========================
    // Clear Redis Cache
    // ==========================
    await redisClient.del(`history:${req.user._id}`);
    await redisClient.del(`favorites:${req.user._id}`);

    res.status(200).json({
      success: true,
      message: "History deleted successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to delete history.",
    });
  }
}

export async function downloadFromHistory(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find history
    const history = await History.findOne({
      _id: id,
      userId,
    });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "History not found.",
      });
    }

    // User preferences
    const preference = await Preference.findOne({ userId });

    if (!preference) {
      return res.status(404).json({
        success: false,
        message: "Preferences not found.",
      });
    }

    // Latest video info
    const video = await getVideoInfo(history.url);

    if (!video) {
      return res.status(400).json({
        success: false,
        message: "Unable to fetch media information.",
      });
    }

    // Duplicate check
    const existingDownload = await Download.findOne({
      videoId: video.id,
      userId,
      platform: detectPlatform(history.url),
      status: {
        $in: ["queued", "downloading", "completed"],
      },
    });

    if (existingDownload) {
      return res.status(409).json({
        success: false,
        message: "This media is already in your download queue.",
      });
    }

    // Create download
    const download = await Download.create({
      videoId: video.id,
      userId,
      url: history.url,
      title: video.title,
      thumbnail: video.thumbnail,
      platform: detectPlatform(history.url),
      duration: video.duration,
      quality: preference.quality,
      format:
        preference.mediaType === "audio"
          ? preference.audioFormat
          : preference.videoFormat,
      status: "queued",
      progress: 0,
    });

    // Add to queue
    downloadQueue.add(download._id);

    // Update history
    history.downloadCount += 1;
    history.lastDownloadedAt = new Date();
    await history.save();

    // ==========================
    // Clear History Cache
    // ==========================
    await redisClient.del(`history:${userId}`);
    await redisClient.del(`favorites:${userId}`);

    return res.status(201).json({
      success: true,
      message: "Download added to queue successfully.",
      data: download,
    });
  } catch (error) {
    console.error("History Download:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to download from history.",
    });
  }
}

export async function getFavorites(req, res) {
  try {
    const userId = req.user._id;
    const cacheKey = `favorites:${userId}`;

    // ==========================
    // Check Redis Cache
    // ==========================
    const cachedFavorites = await redisClient.get(cacheKey);

    if (cachedFavorites) {
      return res.status(200).json({
        success: true,
        data: cachedFavorites,
      });
    }

    // ==========================
    // Fetch from MongoDB
    // ==========================
    const favorites = await History.find({
      userId,
      favorite: true,
    })
      .sort({ updatedAt: -1 })
      .lean();

    // ==========================
    // Save to Redis (2 Minutes)
    // ==========================
    await redisClient.set(cacheKey, favorites, {
      ex: 60 * 2, // 2 Minutes
    });

    return res.status(200).json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch favorites.",
    });
  }
}
