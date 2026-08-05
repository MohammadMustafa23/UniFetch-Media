import Download from "../models/download.model.js";
import downloadQueue from "../queue/download.queue.js";
import Preference from "../../Preferences/models/preferences.model.js";
import { redisClient } from "../../../config/redis.js";
import User from "../../../models/user.model.js";

export async function createDownload(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select(
      "downloadLimit.max downloadLimit.used",
    );
    if (user.downloadLimit.used >= user.downloadLimit.max) {
      return res.status(403).json({
        success: false,
        message: "Download limit reached. Upgrade your plan.",
      });
    }
    const preference = await Preference.findOne({ userId });
    if (!preference) {
      return res.status(404).json({
        success: false,
        message: "Preferences not found.",
      });
    }

    const {
      videoId,
      url,
      title,
      thumbnail,
      platform,
      duration,
      quality = "best",
      format = "mp4",
      fileSize = 0,
    } = req.body;

    const existingDownload = await Download.findOne({
      videoId,
      userId,
      platform,
    });

    if (existingDownload) {
      return res.status(409).json({
        success: false,
        message: "This media is already in your download queue.",
      });
    }

    // =====================================
    // Cloud Storage Limit Check
    // =====================================
    if (preference.storage.provider === "platform") {
      const user = await User.findById(userId).select("cloudStorage");
      const remaining = user.cloudStorage.limit - user.cloudStorage.used;

      if (fileSize && fileSize > remaining) {
        await createNotification({
          userId: user._id,
          title: "Storage Limit Reached",
          message:
            "Your cloud storage is full. Delete some files or upgrade your storage plan to continue downloading.",
          type: "warning",
          metadata: {
            storageUsed: user.cloudStorage.used,
            storageLimit: user.cloudStorage.limit,
          },
        });

        return res.status(403).json({
          success: false,
          message: "Cloud storage limit exceeded.",
          storage: {
            used: user.cloudStorage.used,
            limit: user.cloudStorage.limit,
            remaining,
            required: fileSize,
          },
        });
      }
    }

    const download = await Download.create({
      videoId,
      userId,
      url,
      title,
      thumbnail,
      platform,
      duration,
      quality,
      format,
      fileSize,
      downloadedSize: 0,
      storageProvider: preference.storage.provider,
      status: "queued",
      progress: 0,
    });

    // ✅ Clear Downloads Cache
    await redisClient.del(`downloads:${userId}`);
    await redisClient.del(`history:${req.user._id}`);

    // Add to download queue
    downloadQueue.add(download._id);

    return res.status(201).json({
      success: true,
      message: "Download added to queue successfully.",
      data: download,
    });
  } catch (error) {
    console.error("Create Download Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create download.",
      error: error.message,
    });
  }
}
