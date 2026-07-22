import History from "../models/history.model.js";
import Preference from "../../Preferences/models/preferences.model.js";
import Download from "../../download/\/models/download.model.js";
import { getVideoInfo } from "../../Downloader/utils/ytDlp.js";
import detectPlatform from "../../Downloader/utils/detectPlatform.js";
import downloadQueue from "../../download/queue/download.queue.js";

export const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;

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

    // Toggle favorite
    history.favorite = !history.favorite;

    await history.save();

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
        message: "Error To Delete History",
      });
    }

    const history = await History.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!history) {
      return res.status(404).status({
        message: "History Not Found",
      });
    }

    await history.deleteOne();

    res.status(200).json({
      message: "History Deleted Sucessfully",
    });
  } catch (err) {
    res.status(400).jsom({
      message: "Failed To Delete History",
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
    const favorites = await History.find({
      userId: req.user._id,
      favorite: true,
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch favorites.",
    });
  }
}
