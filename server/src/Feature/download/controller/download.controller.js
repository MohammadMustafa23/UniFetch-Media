import Download from "../models/download.model.js";
import downloadQueue from "../queue/download.bullmq.js";
import Preference from "../../Preferences/models/preferences.model.js";
import { redisClient } from "../../../config/redis.js";
import User from "../../../models/user.model.js";

const SUPPORTED_PLATFORMS = new Set(["youtube", "instagram"]);

export async function createDownload(req, res) {
  try {
    const userId = req.user._id;

    // =====================================================
    // 1. LOAD USER + PREFERENCE IN PARALLEL
    // =====================================================

    const [user, preference] = await Promise.all([
      User.findById(userId)
        .select("_id downloadLimit.max downloadLimit.used cloudStorage")
        .lean(),

      Preference.findOne({ userId }).lean(),
    ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!preference) {
      return res.status(404).json({
        success: false,
        message: "Preferences not found.",
      });
    }

    // =====================================================
    // 2. DOWNLOAD LIMIT
    // =====================================================

    if (user.downloadLimit.used >= user.downloadLimit.max) {
      return res.status(403).json({
        success: false,
        message: "Download limit reached. Upgrade your plan.",
      });
    }

    // =====================================================
    // 3. READ SELECTED DOWNLOAD OPTIONS
    // =====================================================

    const {
      videoId,
      url,
      title,
      thumbnail,
      platform,
      duration,
      mediaType = "video",
      quality = "best",
      format = "mp4",
      fileSize = 0,
    } = req.body;

    // =====================================================
    // 4. BASIC VALIDATION
    // =====================================================

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        message: "Download URL is required.",
      });
    }

    if (!SUPPORTED_PLATFORMS.has(platform)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported platform.",
      });
    }

    if (!["video", "audio"].includes(mediaType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid media type.",
      });
    }

    // =====================================================
    // 5. DUPLICATE CHECK
    // =====================================================

    const existingDownload = await Download.findOne({
      userId,
      videoId,
      platform,
      mediaType,
      format,
      status: {
        $in: ["queued", "downloading", "paused"],
      },
    })
      .select("_id status")
      .lean();

    if (existingDownload) {
      return res.status(409).json({
        success: false,
        message: "This media is already in your download queue.",
        data: {
          downloadId: existingDownload._id,
          status: existingDownload.status,
        },
      });
    }

    // =====================================================
    // 6. CLOUD STORAGE CHECK
    // =====================================================

    const storageProvider = preference.storage?.provider || "device";

    if (storageProvider === "platform") {
      const cloudStorage = user.cloudStorage || {
        used: 0,
        limit: 0,
      };

      const remaining = cloudStorage.limit - cloudStorage.used;

      if (fileSize && fileSize > remaining) {
        return res.status(403).json({
          success: false,
          message: "Cloud storage limit exceeded.",
          storage: {
            used: cloudStorage.used,
            limit: cloudStorage.limit,
            remaining,
            required: fileSize,
          },
        });
      }
    }

    // =====================================================
    // 7. CREATE DOWNLOAD
    // =====================================================

    const download = await Download.create({
      userId,
      videoId: videoId || null,
      url: url.trim(),
      title: title || "Preparing download...",
      thumbnail: thumbnail || "",
      platform,
      duration: Number(duration || 0),
      mediaType,
      quality,
      format,
      fileSize: Number(fileSize || 0),
      downloadedSize: 0,
      storageProvider,
      status: "queued",
      progress: 0,
      error: "",
    });

    // =====================================================
    // 8. ADD BULLMQ JOB
    // =====================================================

    const job = await downloadQueue.add(
      "download",
      {
        downloadId: download._id.toString(),
        userId: userId.toString(),
        url: url.trim(),
        platform,
        quality,
        format,
        mediaType,
        storageProvider,
      },
      {
        jobId: download._id.toString(),
      },
    );

    // =====================================================
    // 9. SAVE BULLMQ JOB ID
    // =====================================================

    await Download.findByIdAndUpdate(download._id, {
      jobId: job.id,
    });

    // =====================================================
    // 10. INVALIDATE DOWNLOAD CACHE
    // =====================================================

    await redisClient.del(`downloads:${userId}`);
    await redisClient.del(`history:${userId}`);

    // =====================================================
    // 11. RETURN IMMEDIATELY
    // =====================================================

    return res.status(202).json({
      success: true,
      message: "Download added to queue.",
      data: {
        downloadId: download._id,
        jobId: job.id,
        status: "queued",
      },
    });
  } catch (error) {
    console.error("[CreateDownload] Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create download.",
      error: error.message,
    });
  }
}
