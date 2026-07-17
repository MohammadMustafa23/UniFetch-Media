import downloadQueue from "../queue/download.queue.js"; // adjust path if needed
import Download from '../models/download.model.js'

export const retryDownload = async (req, res) => {
  try {
    const { id } = req.params;
    const download = await Download.findById(id);

    if (!download) {
      return res.status(404).json({
        success: false,
        message: "Download not found",
      });
    }

    // Don't allow retry if already downloading
    if (["queued", "downloading"].includes(download.status)) {
      return res.status(400).json({
        success: false,
        message: "Download is already in queue.",
      });
    }

    download.status = "queued";
    download.progress = 0;
    download.error = "";
    download.downloadSpeed = "";
    download.eta = "";
    download.filePath = "";

    await download.save();

    // Add back to queue
    downloadQueue.add(download._id);

    return res.status(200).json({
      success: true,
      message: "Download queued successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retry download.",
    });
  }
};

export const pauseDownload = async (req, res) => {
  try {
    const { id } = req.params;
     console.log(id);
    

    await downloadQueue.pause(id);

    return res.status(200).json({
      success: true,
      message: "Download paused.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const resumeDownload = async (req, res) => {
  try {
    const { id } = req.params;
     console.log(id);
    

    await downloadQueue.resume(id);

    return res.status(200).json({
      success: true,
      message: "Download resumed.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelDownload = async (req, res) => {
  try {
    const { id } = req.params;
    await downloadQueue.cancel(id);

    return res.status(200).json({
      success: true,
      message: "Download deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
