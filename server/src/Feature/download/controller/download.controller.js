import Download from "../models/download.model.js";
import downloadQueue from "../queue/download.queue.js";

export async function createDownload(req, res) {
  try {
    const userId = req.user._id;
    const {
      videoId,
      id,
      url,
      title,
      thumbnail,
      platform,
      duration,
      quality = "best",
      format = "mp4",
    } = req.body;

    
    const existingDownload = await Download.findOne({
      videoId,
      userId,
      platform,
      status: { $in: ["queued", "downloading", "completed"] },
    });

    if (existingDownload) {
      return res.status(409).json({
        success: false,
        message: "This media is already in your download queue.",
      });
    }
    // Create download record
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

      status: "queued",
      progress: 0,
    });

    // Add to download queue
    downloadQueue.add(download);

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
