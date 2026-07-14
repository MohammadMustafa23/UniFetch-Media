export default function detectPlatform(url) {
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
    return "youtube";
  }

  if (lowerUrl.includes("instagram.com")) {
    return "instagram";
  }

  if (lowerUrl.includes("facebook.com")) {
    return "facebook";
  }

  if (lowerUrl.includes("tiktok.com")) {
    return "tiktok";
  }

  if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) {
    return "twitter";
  }

  return "other";
}
