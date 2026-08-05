import fs from "fs";
import path from "path";

import Download from "../download/models/download.model.js";
import { getFolderSize } from "../download/utils/getFolderSize.js";
import { redisClient } from "../../config/redis.js";
import User from "../../models/user.model.js";

const VIDEO_EXT = [".mp4", ".mkv", ".webm", ".mov"];
const AUDIO_EXT = [".mp3", ".wav", ".m4a", ".aac"];

export function getStorageStats(folder) {
  const stats = {
    total: 0,
    video: 0,
    audio: 0,
  };

  if (!fs.existsSync(folder)) {
    return stats;
  }

  const items = fs.readdirSync(folder);

  for (const item of items) {
    const fullPath = path.join(folder, item);
    const file = fs.statSync(fullPath);

    if (file.isDirectory()) {
      const child = getStorageStats(fullPath);

      stats.total += child.total;
      stats.video += child.video;
      stats.audio += child.audio;
    } else {
      const ext = path.extname(item).toLowerCase();

      if (VIDEO_EXT.includes(ext)) {
        stats.video += file.size;
        stats.total += file.size;
      } else if (AUDIO_EXT.includes(ext)) {
        stats.audio += file.size;
        stats.total += file.size;
      }
    }
  }

  return stats;
}

export const getStorage = async (req, res) => {
  try {
    const userId = req.user._id;
    const cacheKey = `storage:${userId}`;

    // ==========================
    // Check Redis Cache
    // ==========================
    const cachedStorage = await redisClient.get(cacheKey);

    if (cachedStorage) {
      return res.status(200).json({
        success: true,
        data: cachedStorage,
      });
    }

    // ==========================
    // Local Storage
    // ==========================
    const userFolder = path.join(process.cwd(), "downloads", userId.toString());

    const storage = getStorageStats(userFolder);

    // ==========================
    // User Cloud Storage
    // ==========================
    const user = await User.findById(userId).select("cloudStorage");

    // ==========================
    // Failed Downloads
    // ==========================
    const failedDownloads = await Download.countDocuments({
      userId,
      status: "failed",
    });

    // ==========================
    // Storage Data
    // ==========================
    const storageData = {
      usedStorage: storage.total,
      videoSize: storage.video,
      audioSize: storage.audio,

      cloudStorage: {
        used: user?.cloudStorage?.used || 0,
        limit: user?.cloudStorage?.limit || 0,
        remaining: Math.max(
          0,
          (user?.cloudStorage?.limit || 0) - (user?.cloudStorage?.used || 0),
        ),
        percentage:
          user?.cloudStorage?.limit > 0
            ? Math.round(
                (user.cloudStorage.used / user.cloudStorage.limit) * 100,
              )
            : 0,
      },

      cacheSize: 0,
      failedDownloads,
    };

    // ==========================
    // Save Redis Cache (5 Minutes)
    // ==========================
    await redisClient.set(cacheKey, storageData, {
      ex: 60 * 5,
    });

    return res.status(200).json({
      success: true,
      data: storageData,
    });
  } catch (error) {
    console.error("Get Storage Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const clearCache = async (req, res) => {
  try {
    await Promise.all([
      redisClient.del(`storage:${req.user._id}`),
      redisClient.del(`dashboard:${req.user._id}`),
      redisClient.del(`analytics:${req.user._id}`),
    ]);

    return res.status(200).json({
      success: true,
      message: "Cache cleared successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFailedDownloads = async (req, res) => {
  try {
    const downloads = await Download.find({
      userId: req.user._id,
      status: "failed",
    });

    for (const download of downloads) {
      if (download.filePath && fs.existsSync(download.filePath)) {
        fs.unlinkSync(download.filePath);
      }
    }

    const result = await Download.deleteMany({
      userId: req.user._id,
      status: "failed",
    });

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} failed download(s) removed.`,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
