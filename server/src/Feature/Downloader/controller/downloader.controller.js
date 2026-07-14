import detectPlatform from "../utils/detectPlatform.js";
import { validateDownload } from "../validation/downloader.validation.js";
import { getVideoInfo } from "../utils/ytDlp.js";
import formatVideoInfo from '../utils/formatVideoInfo.js'

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
