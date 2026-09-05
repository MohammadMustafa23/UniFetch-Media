import History from "../models/history.model.js";
import Preference from "../../Preferences/models/preferences.model.js";
import Download from "../../download/models/download.model.js";
import detectPlatform from "../../Downloader/utils/detectPlatform.js";
import downloadQueue from "../../download/queue/download.bullmq.js";
import { redisClient } from "../../../config/redis.js";
import User from "../../../models/user.model.js";

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

    await redisClient.del(`history:${userId}`);
    await redisClient.del(`favorites:${userId}`);

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
    const userId = req.user._id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "History ID is required.",
      });
    }

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

    // Delete from MongoDB
    await history.deleteOne();
    await redisClient.del(`history:${userId}`);
    await redisClient.del(`favorites:${userId}`);
    
    return res.status(200).json({
      success: true,
      message: "History deleted successfully.",
    });
  } catch (error) {
    console.error("[History] Delete failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete history.",
    });
  }
}

export async function downloadFromHistory(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // ==========================
    // Find History
    // ==========================
    const history = await History.findOne({
      _id: id,
      userId,
    }).lean();

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "History not found.",
      });
    }

    // ==========================
    // Get User Preferences
    // ==========================
    const preference = await Preference.findOne({
      userId,
    }).lean();

    if (!preference) {
      return res.status(404).json({
        success: false,
        message: "Preferences not found.",
      });
    }


    const user = await User.findById(userId)
      .select("_id downloadLimit.max downloadLimit.used")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.downloadLimit.used >= user.downloadLimit.max) {
      return res.status(403).json({
        success: false,
        message: "Your download limit has been reached.",
      });
    }

    // ==========================
    // Detect Platform
    // ==========================
    const platform = detectPlatform(history.url);

    if (!["youtube", "instagram"].includes(platform)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported media platform.",
      });
    }

    // ==========================
    // Duplicate Check
    // ==========================
    const existingDownload = await Download.findOne({
      userId,
      url: history.url,
      status: {
        $in: ["queued", "downloading", "completed"],
      },
    })
      .select("_id status")
      .lean();

    if (existingDownload) {
      return res.status(409).json({
        success: false,
        message: "This media is already in your downloads.",
      });
    }

    // ==========================
    // Create Download Record
    // ==========================
    const download = await Download.create({
      userId,
      url: history.url,
      platform,

      // Worker will fetch these from yt-dlp
      videoId: history.videoId || null,
      title: history.title || "Preparing download...",
      thumbnail: history.thumbnail || "",
      duration: history.duration || 0,

      status: "queued",
      progress: 0,

      quality: preference.quality,
      format:
        preference.mediaType === "audio"
          ? preference.audioFormat
          : preference.videoFormat,

      mediaType: preference.mediaType || "video",
      storageProvider: preference.storage?.provider,
    });

    // ==========================
    // Add BullMQ Job
    // ==========================
    const job = await downloadQueue.add(
      "download",
      {
        downloadId: download._id.toString(),
        userId: userId.toString(),
        url: history.url,
        platform,

        quality: preference.quality,
        format:
          preference.mediaType === "audio"
            ? preference.audioFormat
            : preference.videoFormat,

        mediaType: preference.mediaType || "video",
        storageProvider: preference.storage?.provider,
      },
      {
        jobId: download._id.toString(),
      },
    );

    // ==========================
    // Save Job ID
    // ==========================
    await Download.findByIdAndUpdate(download._id, {
      jobId: job.id,
    });

    // ==========================
    // Update History
    // ==========================
    await History.findByIdAndUpdate(history._id, {
      $inc: {
        downloadCount: 1,
      },
      $set: {
        lastDownloadedAt: new Date(),
      },
    });

    // ==========================
    // Clear Cache
    // ==========================
    await Promise.all([
      redisClient.del(`history:${userId}`),
      redisClient.del(`favorites:${userId}`),
    ]);

    return res.status(202).json({
      success: true,
      message: "Download added to queue.",
      data: {
        downloadId: download._id,
        status: "queued",
        jobId: job.id,
      },
    });
  } catch (error) {
    console.error("History Download:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add download to queue.",
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
