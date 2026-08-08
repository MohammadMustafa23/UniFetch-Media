export default function detectPlatform(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();

    if (
      hostname === "youtube.com" ||
      hostname === "www.youtube.com" ||
      hostname === "youtu.be"
    ) {
      return "youtube";
    }

    if (hostname === "instagram.com" || hostname === "www.instagram.com") {
      return "instagram";
    }

    if (hostname === "facebook.com" || hostname === "www.facebook.com") {
      return "facebook";
    }

    if (hostname === "tiktok.com" || hostname === "www.tiktok.com") {
      return "tiktok";
    }

    if (
      hostname === "twitter.com" ||
      hostname === "www.twitter.com" ||
      hostname === "x.com" ||
      hostname === "www.x.com"
    ) {
      return "twitter";
    }

    return "other";
  } catch {
    return "other";
  }
}
