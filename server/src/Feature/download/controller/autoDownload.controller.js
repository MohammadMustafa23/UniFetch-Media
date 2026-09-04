import Preference from "../../Preferences/models/preferences.model.js";
import Download from "../models/download.model.js";
import downloadQueue from "../queue/download.bullMQ.js";
import User from "../../../models/user.model.js";
import detectPlatform from "../../Downloader/utils/detectPlatform.js";

const SUPPORTED_PLATFORMS = new Set(["youtube", "instagram"]);

export async function autoDownload(req, res) {
  let download = null;

  try {
    const userId = req.user._id;
    const { url } = req.body;

    // ---------------------------------------------------------
    // 1. Basic request validation
    // ---------------------------------------------------------
    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        message: "URL is required.",
      });
    }

    const cleanUrl = url.trim();

    if (!cleanUrl) {
      return res.status(400).json({
        success: false,
        message: "URL is required.",
      });
    }

    // ---------------------------------------------------------
    // 2. Detect platform
    // ---------------------------------------------------------
    const platform = detectPlatform(cleanUrl);

    if (!SUPPORTED_PLATFORMS.has(platform)) {
      return res.status(400).json({
        success: false,
        message: "Only YouTube and Instagram are supported.",
      });
    }

    // ---------------------------------------------------------
    // 3. Load user + preference in parallel
    // ---------------------------------------------------------
    const [user, preference] = await Promise.all([
      User.findById(userId)
        .select("_id downloadLimit.max downloadLimit.used")
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
        message: "User preferences not found.",
      });
    }

    // ---------------------------------------------------------
    // 4. Check download limit
    // ---------------------------------------------------------
    if (user.downloadLimit.used >= user.downloadLimit.max) {
      return res.status(403).json({
        success: false,
        message: "Download limit reached.",
      });
    }

    // ---------------------------------------------------------
    // 5. Prevent obvious duplicate active downloads
    //
    // IMPORTANT:
    // videoId is NOT available here anymore because we don't
    // call yt-dlp inside the HTTP request.
    // ---------------------------------------------------------
    const existingDownload = await Download.findOne({
      userId,
      platform,
      url: cleanUrl,
      status: {
        $in: ["queued", "downloading", "completed"],
      },
    })
      .select("_id status")
      .lean();

    if (existingDownload) {
      return res.status(409).json({
        success: false,
        message:
          "This media has already been downloaded or is already in the queue.",
        data: {
          downloadId: existingDownload._id,
          status: existingDownload.status,
        },
      });
    }

    // ---------------------------------------------------------
    // 6. Create lightweight DB record
    //
    // NO yt-dlp
    // NO FFmpeg
    // NO file-size check
    // NO Cloudinary
    // NO video metadata
    // NO history creation
    // ---------------------------------------------------------
    download = await Download.create({
      userId,
      url: cleanUrl,
      platform,

      videoId: null,
      title: "Preparing download...",
      thumbnail: "",
      duration: 0,

      quality: preference.quality || "best",
      format: "mp4",
      mediaType: "video",

      storageProvider: preference.storage?.provider || "device",

      status: "queued",
      progress: 0,

      fileSize: 0,
      downloadedSize: 0,
      downloadSpeed: "",
      eta: "",

      filePath: "",
      publicId: null,
      error: "",
    });

    // ---------------------------------------------------------
    // 7. Push job to BullMQ
    // ---------------------------------------------------------
    const job = await downloadQueue.add(
      "download",
      {
        downloadId: download._id.toString(),
        userId: userId.toString(),
        url: cleanUrl,
        platform,

        quality: preference.quality || "best",
        format: "mp4",
        mediaType: "video",

        storageProvider: preference.storage?.provider || "device",
      },
      {
        jobId: download._id.toString(),
      },
    );

    // ---------------------------------------------------------
    // 8. Save BullMQ job ID
    // ---------------------------------------------------------
    await Download.findByIdAndUpdate(download._id, {
      jobId: job.id,
    });

    // ---------------------------------------------------------
    // 9. Respond immediately
    // ---------------------------------------------------------
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
    console.error("[AutoDownload]", error.message);

    // If Mongo record was created but BullMQ failed,
    // don't leave a fake queued download behind.
    if (download?._id) {
      try {
        await Download.findByIdAndDelete(download._id);
      } catch (cleanupError) {
        console.error("[AutoDownload Cleanup]", cleanupError.message);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Unable to add download to queue.",
    });
  }
}
