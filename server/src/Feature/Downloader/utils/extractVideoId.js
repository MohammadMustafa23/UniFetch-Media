export function extractVideoId(url, platform) {
  try {
    if (!url || !platform) {
      return null;
    }

    const parsed = new URL(url.trim());
    const hostname = parsed.hostname.toLowerCase();

    // =========================
    // YOUTUBE
    // =========================
    if (platform === "youtube") {
      // youtu.be/VIDEO_ID
      if (hostname === "youtu.be") {
        return parsed.pathname.split("/").filter(Boolean)[0] || null;
      }

      // youtube.com/watch?v=VIDEO_ID
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v") || null;
      }

      // youtube.com/shorts/VIDEO_ID
      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/")[2] || null;
      }

      // youtube.com/embed/VIDEO_ID
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/")[2] || null;
      }

      // youtube.com/live/VIDEO_ID
      if (parsed.pathname.startsWith("/live/")) {
        return parsed.pathname.split("/")[2] || null;
      }

      // youtube.com/v/VIDEO_ID
      if (parsed.pathname.startsWith("/v/")) {
        return parsed.pathname.split("/")[2] || null;
      }

      return null;
    }

    // =========================
    // INSTAGRAM
    // =========================
    if (platform === "instagram") {
      const parts = parsed.pathname.split("/").filter(Boolean);

      /*
        /reel/ABC123/
        /reels/ABC123/
        /p/ABC123/
        /tv/ABC123/
      */

      const types = ["reel", "reels", "p", "tv"];

      const typeIndex = parts.findIndex((part) =>
        types.includes(part.toLowerCase()),
      );

      if (typeIndex !== -1 && parts[typeIndex + 1]) {
        return parts[typeIndex + 1];
      }

      return null;
    }

    return null;
  } catch {
    return null;
  }
}
