import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import { spawn } from "child_process";
import fs from "fs";
import { YT_COOKIES_PATH } from '../../../config/env.js'
const execFileAsync = promisify(execFile);

const BIN_DIR = path.resolve(process.cwd(), "bin");

const isWindows = process.platform === "win32";

const YT_DLP_PATH = isWindows
  ? path.join(BIN_DIR, "yt-dlp.exe")
  : path.join(BIN_DIR, "yt-dlp");

const FFMPEG_PATH = isWindows
  ? path.join(BIN_DIR, "ffmpeg.exe")
  : path.join(BIN_DIR, "ffmpeg");

// Path to your exported YouTube cookies.txt (Netscape format).
const YOUTUBE_COOKIES_PATH = YT_COOKIES_PATH || "/etc/secrets/youtube_cookies.txt";

const YOUTUBE_USER_AGENT =
  "com.google.android.youtube/19.29.37 (Linux; U; Android 14) gzip";

const INSTAGRAM_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function isYouTubeUrl(url) {
  return /youtube\.com|youtu\.be/i.test(url);
}

function isInstagramUrl(url) {
  return /instagram\.com/i.test(url);
}

// Only YouTube needs cookies in our setup
function getCookiesPathForUrl(url) {
  if (isYouTubeUrl(url)) {
    return fs.existsSync(YOUTUBE_COOKIES_PATH) ? YOUTUBE_COOKIES_PATH : null;
  }
  return null;
}

// Shared anti-bot / resiliency args used by both getVideoInfo and downloadVideo
function getAntiBotArgs(url) {
  const args = [
    "--retries",
    "10",
    "--fragment-retries",
    "10",
    "--extractor-retries",
    "3",
    "--sleep-requests",
    "1",
    "--force-ipv4", // datacenter IPv6 ranges get flagged more on some hosts
  ];

  const cookiesPath = getCookiesPathForUrl(url);
  if (cookiesPath) {
    args.push("--cookies", cookiesPath);
  }

  if (isYouTubeUrl(url)) {
    args.push(
      "--extractor-args",
      "youtube:player_client=android,ios,web;player_skip=webpage,configs",
      "--user-agent",
      YOUTUBE_USER_AGENT,
    );
  }

  if (isInstagramUrl(url)) {
    args.push("--user-agent", INSTAGRAM_USER_AGENT);
  }

  return { args, cookiesPath };
}

export async function getVideoInfo(url) {
  if (!url || typeof url !== "string") {
    throw new Error("A valid URL is required.");
  }

  const cleanUrl = url.trim();
  const { args: antiBotArgs, cookiesPath } = getAntiBotArgs(cleanUrl);

  const { stdout } = await execFileAsync(
    YT_DLP_PATH,
    [
      "--dump-single-json",
      "--no-playlist",
      "--no-warnings",
      "--skip-download",
      "--ffmpeg-location",
      FFMPEG_PATH,
      ...antiBotArgs,
      cleanUrl,
    ],
    {
      maxBuffer: 20 * 1024 * 1024,
      timeout: 60_000,
      killSignal: "SIGKILL",
    },
  );

  if (!stdout?.trim()) {
    throw new Error("Unable to fetch media information.");
  }

  console.log("YT-DLP getVideoInfo:", {
    url: cleanUrl,
    usingCookies: Boolean(cookiesPath),
  });

  return JSON.parse(stdout);
}

function getFormatSelector(quality, type) {
  // Audio Only
  if (type === "audio") {
    return "bestaudio/best";
  }

  switch (quality) {
    case "1080p":
      return "bestvideo*[height<=1080]+bestaudio/bestvideo*[height<=1080]/best[height<=1080]/best";

    case "720p":
      return "bestvideo*[height<=720]+bestaudio/bestvideo*[height<=720]/best[height<=720]/best";

    case "480p":
      return "bestvideo*[height<=480]+bestaudio/bestvideo*[height<=480]/best[height<=480]/best";

    case "360p":
      return "bestvideo*[height<=360]+bestaudio/bestvideo*[height<=360]/best[height<=360]/best";

    case "240p":
      return "bestvideo*[height<=240]+bestaudio/bestvideo*[height<=240]/best[height<=240]/best";

    case "144p":
      return "bestvideo*[height<=144]+bestaudio/bestvideo*[height<=144]/best[height<=144]/best";

    default:
      return "bv*+ba/b";
  }
}

export function downloadVideo({
  url,
  outputPath,
  quality = "best",
  format = "mp4",
  mediaType = "video",
}) {
  const { args: antiBotArgs, cookiesPath } = getAntiBotArgs(url);

  const args = [
    "--newline",
    "--no-playlist",
    "--ffmpeg-location",
    FFMPEG_PATH,
    ...antiBotArgs,
  ];

  // ============================
  // AUDIO DOWNLOAD
  // ============================
  if (mediaType === "audio") {
    args.push(
      "-f",
      "bestaudio/best",
      "-x",
      "--audio-format",
      format,
      "--audio-quality",
      "0",
      "-o",
      outputPath,
    );
  }

  // ============================
  // VIDEO DOWNLOAD
  // ============================
  else {
    args.push(
      "-f",
      getFormatSelector(quality, "video"),
      "-o",
      outputPath,
      "--merge-output-format",
      format,
    );
  }

  args.push(
    "--continue",
    "--progress-template",
    "%(progress._percent_str)s|%(progress.speed)s|%(progress.eta)s",
  );

  // URL should always be last
  args.push(url);

  console.log("YT-DLP downloadVideo:", {
    mediaType,
    quality,
    format,
    usingCookies: Boolean(cookiesPath),
    args,
  });

  return spawn(YT_DLP_PATH, args);
}
