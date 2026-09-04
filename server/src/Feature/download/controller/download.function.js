import downloadQueue from "../queue/download.queue.js";
import Download from "../models/download.model.js";
import { getIO } from "../../../socket/socket.js";

// ============================================================
// Retry Download
// ============================================================

export const retryDownload = async (req, res) => {
  try {
    const { id } = req.params;

    const download = await Download.findOne({
      _id: id,
      userId: req.user._id,
    });

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

    await downloadQueue.retry(id);

    return res.status(200).json({
      success: true,
      message: "Download added to queue.",
    });
  } catch (error) {
    console.error("[Retry Download]", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to retry download.",
    });
  }
};

// ============================================================
// Pause Download
// ============================================================

export const pauseDownload = async (req, res) => {
  try {
    const { id } = req.params;

    const download = await Download.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!download) {
      return res.status(404).json({
        success: false,
        message: "Download not found.",
      });
    }

    await downloadQueue.pause(id);

    return res.status(200).json({
      success: true,
      message: "Download paused successfully.",
    });
  } catch (error) {
    console.error("[Pause Download]", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to pause download.",
    });
  }
};

// ============================================================
// Resume Download
// ============================================================

export const resumeDownload = async (req, res) => {
  try {
    const { id } = req.params;

    const download = await Download.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!download) {
      return res.status(404).json({
        success: false,
        message: "Download not found.",
      });
    }

    await downloadQueue.resume(id);

    return res.status(200).json({
      success: true,
      message: "Download resumed successfully.",
    });
  } catch (error) {
    console.error("[Resume Download]", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to resume download.",
    });
  }
};

// ============================================================
// Cancel Download
// ============================================================

export const cancelDownload = async (req, res) => {
  try {
    const { id } = req.params;

    const download = await Download.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!download) {
      return res.status(404).json({
        success: false,
        message: "Download not found.",
      });
    }

    await downloadQueue.cancel(id);

    // Frontend immediately removes the item.
    getIO().to(download.userId.toString()).emit("download-deleted", {
      downloadId: id,
    });

    return res.status(200).json({
      success: true,
      message: "Download cancelled successfully.",
    });
  } catch (error) {
    console.error("[Cancel Download]", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to cancel download.",
    });
  }
};
