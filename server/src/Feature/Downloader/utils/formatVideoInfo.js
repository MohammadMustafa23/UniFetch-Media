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

      size: formatSize(format.filesize || format.filesize_approx),
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

export default function formatVideoInfo(video) {
  const videoFormats = extractVideoFormats(video.formats);

  return {
    /* ===========================
       Basic Information
    =========================== */

    id: video.id,

    platform: video.extractor_key?.toLowerCase(),

    type:
      video.live_status === "is_live"
        ? "live"
        : video.duration <= 180
          ? "short"
          : "video",

    title: video.title,

    description: video.description?.slice(0, 300),

    thumbnail: video.thumbnail,

    duration: video.duration,

    durationString: formatDuration(video.duration),

    uploadDate: formatDate(video.upload_date),

    timestamp: video.timestamp,

    webpageUrl: video.webpage_url,

    /* ===========================
       Channel Information
    =========================== */

    uploader: {
      id: video.channel_id,

      name: video.uploader,

      url: video.uploader_url,

      verified: video.channel_is_verified ?? false,
    },

    /* ===========================
       Statistics
    =========================== */

    statistics: {
      views: {
        count: video.view_count,
        text: formatNumber(video.view_count),
      },

      likes: {
        count: video.like_count,
        text: formatNumber(video.like_count),
      },

      comments: {
        count: video.comment_count,
        text: formatNumber(video.comment_count),
      },
    },

    /* ===========================
       Media
    =========================== */

    media: {
      live: video.is_live,

      wasLive: video.was_live,

      availability: video.availability,

      ageLimit: video.age_limit,
    },

    /* ===========================
       Quick Options
    =========================== */

    qualities: [...new Set(videoFormats.map((item) => item.quality))],

    /* ===========================
       Download Options
    =========================== */

    downloads: {
      video: videoFormats,

      audio: extractAudioFormats(video.formats),
    },
  };
}
