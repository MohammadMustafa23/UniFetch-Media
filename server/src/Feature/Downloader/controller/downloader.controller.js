import detectPlatform from "../utils/detectPlatform.js";
import { validateDownload } from "../validation/downloader.validation.js";
import { getVideoInfo } from "../utils/ytDlp.js";
import formatVideoInfo from "../utils/formatVideoInfo.js";
import { createHistoryService } from "../../History/service/history.service.js";
import History from '../../History/models/history.model.js'

export async function getDownloadInfo(req, res) {
  try {
    // Validate Request
    const validation = validateDownload(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const history = await History.findOne({
      userId: req.user._id,
      url: req.body.url,
    });

    if (history) {
      return res.status(200).json({
        success: true,
        fromCache: true,
        message: "Video found in history.",
        data: history,
      });
    }

    // Detect Platform
    const platform = detectPlatform(req.body.url);

    // Unsupported Platform
    if (platform === "other") {
      return res.status(400).json({
        success: false,
        message: "Unsupported platform.",
      });
    }

    const videoInfo = await getVideoInfo(req.body.url);

    const formatted = formatVideoInfo(videoInfo);

    // Save History
    await createHistoryService({
      userId: req.user._id,
      url: req.body.url,
      platform,
      videoInfo: formatted,
    });

    return res.status(200).json({
      success: true,
      message: "Video information fetched successfully.",
      data: formatted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
