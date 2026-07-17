const isSupportedUrl = (text) => {
  try {
    const url = new URL(text.trim());

    const hosts = [
      "youtube.com",
      "www.youtube.com",
      "youtu.be",
      "instagram.com",
      "www.instagram.com",
      "facebook.com",
      "fb.watch",
      "tiktok.com",
      "x.com",
      "twitter.com",
    ];

    return hosts.some(
      (host) =>
        url.hostname === host || url.hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
};

export default isSupportedUrl;