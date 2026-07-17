import Preference from "../../Preferences/models/preferences.model.js";
import { getVideoInfo } from "../../Downloader/utils/ytDlp.js";
import detectPlatform from "../../Downloader/utils/detectPlatform.js";

import Download from "../models/download.model.js";
import downloadQueue from "../queue/download.queue.js";

export async function autoDownload(req, res) {
  try {
    const { url } = req.body;

    if (!url ) {
      return res.status(400).json({
        success: false,
        message: "URL is required.",
      });
    }

    const userId = req.user._id;

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

    // Prepare download data
    const downloadData = {
      videoId: video.id,
      userId,
      url,
      title: video.title,
      thumbnail: video.thumbnail,
      platform: detectPlatform(url),
      duration: video.duration,
      quality: preference.download.quality,
      format:
        preference.download.mediaType === "audio"
          ? preference.download.audioFormat
          : preference.download.videoFormat,
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
    });

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
