import Preference from "../../Preferences/models/preferences.model.js";
import { getVideoInfo } from "../../Downloader/utils/ytDlp.js";
import Download from "../models/download.model.js";
import downloadQueue from "../queue/download.queue.js";

import { redisClient } from "../../../config/redis.js";
import History from "../../History/models/history.model.js";
import User from "../../../models/user.model.js";
import detectPlatform from "../../Downloader/utils/detectPlatform.js";
import { extractVideoId } from "../../Downloader/utils/extractVideoId.js";
import { createHistoryService } from "../../History/service/history.service.js";

export async function autoDownload(req, res) {
  try {
    const { url } = req.body;
    // Validate Request

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required.",
      });
    }

    // Detect Platform
    const platform = detectPlatform(url);

    if (platform !== "youtube" && platform !== "instagram") {
      return res.status(400).json({
        success: false,
        message: "Unsupported platform.",
      });
    }

    const videoId = extractVideoId(url, platform);

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: "Unsupported URL.",
      });
    }

    const cacheKey = `video-info:${platform}:${videoId}`;
    const cachedVideo = await redisClient.get(cacheKey);

    if (cachedVideo) {
      return res.status(200).json({
        success: true,
        fromCache: true,
        message: "Video information fetched successfully.",
        data: cachedVideo,
      });
    }
    

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

    // Get user preferences
    const preference = await Preference.findOne({ userId });

    if (!preference) {
      return res.status(404).json({
        success: false,
        message: "Preferences not found.",
      });
    }


    // Get video information
    const video = await getVideoInfo(url);

    if (!video) {
      return res.status(400).json({
        success: false,
        message: "Unable to fetch video information.",
      });
    }

    // =====================================
    // Cloud Storage Limit Check
    // =====================================
    const fileSize = video.filesize ?? video.filesize_approx;

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

    const downloadData = {
      videoId: video.id,
      userId,
      url,
      title: video.title,
      thumbnail: video.thumbnail,
      platform: platform,
      duration: video.duration,
      quality: preference.quality,
      format: "mp4",
      mediaType : "video",
      storageProvider: preference.storage.provider,
    };

    // Check duplicate
    const existingDownload = await Download.findOne({
      videoId: downloadData.videoId,
      userId: downloadData.userId,
      platform: downloadData.platform,
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

    // Create download record
    const download = await Download.create({
      ...downloadData,
      status: "queued",
      progress: 0,
      // Save estimated size from yt-dlp
      fileSize: fileSize || 0,
      downloadedSize: 0,
    });

    // ✅ Clear Downloads Cache
    await redisClient.del(`downloads:${userId}`);
    await redisClient.del(`history:${req.user._id}`);

    const history = await History.findOne({
      userId: req.user._id,
      platform: downloadData.platform,
      videoId: downloadData.videoId,
    }).lean();

    if (!history) {
      await createHistoryService({
        userId: req.user._id,
        url,
        platform: downloadData.platform,
        videoInfo: downloadData,
      });
    }

    // Add to queue
    downloadQueue.add(download._id);

    return res.status(201).json({
      success: true,
      message: "Download added to queue successfully.",
      data: download,
    });
  } catch (error) {
    console.error("Auto Download Error:", error);

    return res.status(500).json({
      success: false,
      message: "Auto download failed.",
      error: error.message,
    });
  }
}
