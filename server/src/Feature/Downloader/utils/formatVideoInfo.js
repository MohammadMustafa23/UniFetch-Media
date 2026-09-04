function extractAudioFormats(formats) {
  const result = [];
  const added = new Set();
  for (const format of formats) {
    if (!format.acodec || format.acodec === "none") continue;
    if (format.vcodec !== "none") continue;
    const key = `${format.ext}-${format.abr}`;

    if (added.has(key)) continue;

    added.add(key);

    result.push({
      formatId: format.format_id,

      extension: format.ext,

      bitrate: format.abr,

      codec: format.acodec,

      fileSize: {
        bytes: format.filesize ?? format.filesize_approx ?? 0,
        text: formatSize(format.filesize ?? format.filesize_approx),
      },
    });
  }
  return result.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
}
function formatDuration(seconds) {
  if (!seconds) return "0:00";

  const h = Math.floor(seconds / 3600);

  const m = Math.floor((seconds % 3600) / 60);

  const s = seconds % 60;

  if (h) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  return `${m}:${String(s).padStart(2, "0")}`;
}
function formatSize(bytes) {
  if (!bytes) return null;

  const units = ["B", "KB", "MB", "GB"];

  let size = bytes;

  let unit = 0;

  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;

    unit++;
  }

  return `${size.toFixed(2)} ${units[unit]}`;
}
function extractVideoFormats(formats) {
  const result = [];

  const added = new Set();

  for (const format of formats) {
    // Skip if no video stream
    if (!format.vcodec || format.vcodec === "none") continue;

    // Skip if dimensions are missing
    if (!format.width || !format.height) continue;

    // Normalize quality for both landscape and portrait videos
    const quality =
      format.format_note ||
      getQualityLabel(Math.min(format.width, format.height));

    // Prevent duplicate entries
    const key = `${quality}-${format.ext}`;

    if (added.has(key)) continue;

    added.add(key);

    result.push({
      formatId: format.format_id,

      quality,

      container: format.ext.toUpperCase(),

      fps: format.fps || null,

      videoCodec: format.vcodec,

      size: formatSize(format.filesize || format.filesize_approx),

      audioIncluded: format.acodec !== "none",
    });
  }

  return result.sort((a, b) => {
    return parseInt(b.quality) - parseInt(a.quality);
  });
}
function formatDate(date) {
  if (!date) return null;

  return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`;
}
function formatNumber(num) {
  if (!num) return "0";

  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";

  if (num >= 1000) return (num / 1000).toFixed(1) + "K";

  return num.toString();
}
function getQualityLabel(height) {
  const map = {
    2160: "2160p",
    1440: "1440p",
    1080: "1080p",
    720: "720p",
    480: "480p",
    360: "360p",
    240: "240p",
    144: "144p",
  };

  return map[height] || `${height}p`;
}
export default function formatVideoInfo(video, url) {
  const platform = video.extractor_key?.toLowerCase();
  const isInstagram = platform === "instagram";

  const videoFormats = extractVideoFormats(video.formats);

  // =====================================================
  // TITLE
  // =====================================================

  const title = isInstagram
    ? video.description?.trim() || video.title || "Instagram Video"
    : video.title || "Untitled Video";

  // =====================================================
  // BASIC INFO
  // =====================================================

  return {
    id: video.id,
    url,
    platform,

    fileSize: {
      bytes: video.filesize ?? video.filesize_approx ?? 0,
      text: formatSize(video.filesize ?? video.filesize_approx),
    },

    type:
      video.live_status === "is_live"
        ? "live"
        : video.duration <= 180
          ? "short"
          : "video",

    title,

    description: video.description?.slice(0, 300) || "",

    thumbnail: video.thumbnail || "",

    duration: video.duration ?? null,

    durationString:
      video.duration != null ? formatDuration(video.duration) : "",

    uploadDate: video.upload_date ? formatDate(video.upload_date) : "",

    timestamp: video.timestamp ?? null,

    webpageUrl: video.webpage_url || url,

    // ===================================================
    // CHANNEL / CREATOR
    // ===================================================

    uploader: {
      id: video.channel_id || video.uploader_id || null,

      name: video.uploader || "",

      url: video.uploader_url || "",

      verified: video.channel_is_verified ?? false,
    },

    // ===================================================
    // STATISTICS
    // ===================================================

    statistics: {
      views: {
        count: video.view_count ?? null,
        text: video.view_count != null ? formatNumber(video.view_count) : "",
      },

      likes: {
        count: video.like_count ?? null,
        text: video.like_count != null ? formatNumber(video.like_count) : "",
      },

      comments: {
        count: video.comment_count ?? null,
        text:
          video.comment_count != null ? formatNumber(video.comment_count) : "",
      },
    },

    // ===================================================
    // MEDIA
    // ===================================================

    media: {
      live: video.is_live ?? false,

      wasLive: video.was_live ?? false,

      availability: video.availability || null,

      ageLimit: video.age_limit ?? 0,
    },

    // ===================================================
    // QUICK OPTIONS
    // ===================================================

    qualities: [
      ...new Set(videoFormats.map((item) => item.quality).filter(Boolean)),
    ],

    // ===================================================
    // DOWNLOAD OPTIONS
    // ===================================================

    downloads: {
      video: videoFormats,

      audio: extractAudioFormats(video.formats),
    },
  };
}
