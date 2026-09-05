import detectPlatform from "../utils/detectPlatform.js";
import { validateDownload } from "../validation/downloader.validation.js";
import { getVideoInfo } from "../utils/ytDlp.js";
import formatVideoInfo from "../utils/formatVideoInfo.js";
import { redisClient } from "../../../config/redis.js";
import { extractVideoId } from "../utils/extractVideoId.js";

const SUPPORTED_PLATFORMS = new Set(["youtube", "instagram"]);
const PREVIEW_CACHE_TTL = 60 * 10; // 10 minutes

export async function getDownloadInfo(req, res) {
  try {
    // =====================================================
    // 1. VALIDATE REQUEST
    // =====================================================

    const validation = validateDownload(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const url = req.body.url.trim();

    // =====================================================
    // 2. DETECT PLATFORM
    // =====================================================

    const platform = detectPlatform(url);

    if (!SUPPORTED_PLATFORMS.has(platform)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported platform.",
      });
    }

    // =====================================================
    // 3. EXTRACT VIDEO ID
    // =====================================================

    const videoId = extractVideoId(url, platform);

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: "Unsupported URL.",
      });
    }

    // =====================================================
    // 4. REDIS PREVIEW CACHE
    // =====================================================

    const cacheKey = `video-info:${platform}:${videoId}`;
    const cachedVideo = await redisClient.get(cacheKey);

    if (cachedVideo) {
      return res.status(200).json({
        success: true,
        fromCache: true,
        message: "Video information fetched successfully.",
        data: cachedVideo,
      });
    }

    // =====================================================
    // 5. FETCH MEDIA INFORMATION
    // =====================================================

    const videoInfo = await getVideoInfo(url);

    if (!videoInfo) {
      return res.status(404).json({
        success: false,
        message: "Unable to fetch video information.",
      });
    }

    // =====================================================
    // 6. FORMAT PREVIEW
    // =====================================================

    const formatted = formatVideoInfo(videoInfo, url);

    // =====================================================
    // 7. CACHE PREVIEW
    // =====================================================

    await redisClient.set(cacheKey, formatted, {
      ex: PREVIEW_CACHE_TTL,
    });

    // =====================================================
    // 8. RETURN PREVIEW
    // =====================================================

    return res.status(200).json({
      success: true,
      fromCache: false,
      message: "Video information fetched successfully.",
      data: formatted,
    });
  } catch (error) {
    console.error("[DownloadInfo] Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch video information.",
    });
  }
}
