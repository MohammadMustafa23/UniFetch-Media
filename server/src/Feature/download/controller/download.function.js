import downloadQueue from "../queue/download.queue.js";
import Download from "../models/download.model.js";
import { getIO } from "../../../socket/socket.js";

// ==============================
// Retry Download
// ==============================
export const retryDownload = async (req, res) => {
  try {
    const { id } = req.params;

    const download = await Download.findById(id);

    if (!download) {
      return res.status(404).json({
        success: false,
        message: "Download not found.",
      });
    }

    if (["queued", "downloading"].includes(download.status)) {
      return res.status(400).json({
        success: false,
        message: "Download is already in progress.",
      });
    }

    download.status = "queued";
    download.progress = 0;
    download.error = "";
    download.downloadSpeed = "";
    download.eta = "";
    download.filePath = "";

    await download.save();

    downloadQueue.add(download._id);

    return res.status(200).json({
      success: true,
      message: "Download added to queue.",
    });
  } catch (error) {
    console.error("Retry Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retry download.",
    });
  }
};

// ==============================
// Pause Download
// ==============================
export const pauseDownload = async (req, res) => {
  try {
    const { id } = req.params;

    const download = await Download.findById(id);

    if (!download) {
      return res.status(404).json({
        success: false,
        message: "Download not found.",
      });
    }

    console.log("Pause Request:", id);
    console.log("Current Status:", download.status);

    await downloadQueue.pause(id);

    return res.status(200).json({
      success: true,
      message: "Download paused successfully.",
    });
  } catch (error) {
    console.error("Pause Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Resume Download
// ==============================
export const resumeDownload = async (req, res) => {
  try {
    const { id } = req.params;

    const download = await Download.findById(id);

    if (!download) {
      return res.status(404).json({
        success: false,
        message: "Download not found.",
      });
    }

    console.log("Resume Request:", id);
    console.log("Current Status:", download.status);

    await downloadQueue.resume(id);

    return res.status(200).json({
      success: true,
      message: "Download resumed successfully.",
    });
  } catch (error) {
    console.error("Resume Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const cancelDownload = async (req, res) => {
  try {
    const { id } = req.params;

    const download = await Download.findById(id);

    if (!download) {
      return res.status(404).json({
        success: false,
        message: "Download not found.",
      });
    }

    // Stop download & remove from queue
    await downloadQueue.cancel(id);

    // Notify frontend immediately
    getIO().to(download.userId.toString()).emit("download-deleted", {
      downloadId: id,
    });

    return res.status(200).json({
      success: true,
      message: "Download cancelled successfully.",
    });
  } catch (error) {
    console.error("Delete Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};