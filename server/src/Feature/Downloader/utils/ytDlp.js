import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import { spawn } from "child_process";
import fs from "fs";

import { YT_COOKIES_PATH } from "../../../config/env.js";

const execFileAsync = promisify(execFile);

// =====================================================
// PATHS
// =====================================================

const BIN_DIR = path.resolve(process.cwd(), "bin");

const isWindows = process.platform === "win32";

const YT_DLP_PATH = isWindows
  ? path.join(BIN_DIR, "yt-dlp.exe")
  : path.join(BIN_DIR, "yt-dlp");

const FFMPEG_PATH = isWindows
  ? path.join(BIN_DIR, "ffmpeg.exe")
  : path.join(BIN_DIR, "ffmpeg");

// =====================================================
// COOKIES
// =====================================================
const YOUTUBE_COOKIES_PATH =
  YT_COOKIES_PATH || "/etc/secrets/youtube_cookies.txt";
const DENO_PATH = process.env.DENO_PATH || "deno";
// =====================================================
// USER AGENTS
// =====================================================

const YOUTUBE_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/124.0.0.0 Safari/537.36";

const INSTAGRAM_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/124.0.0.0 Safari/537.36";

// =====================================================
// PLATFORM HELPERS
// =====================================================

function getHostname(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function isYouTubeUrl(url) {
  const hostname = getHostname(url);

  return (
    hostname === "youtube.com" ||
    hostname === "www.youtube.com" ||
    hostname === "m.youtube.com" ||
    hostname === "music.youtube.com" ||
    hostname === "youtu.be"
  );
}

function isInstagramUrl(url) {
  const hostname = getHostname(url);
  return hostname === "instagram.com" || hostname === "www.instagram.com";
}

// =====================================================
// COOKIES
// =====================================================
function getWritableCookiesPath(url) {
  if (!isYouTubeUrl(url)) {
    return null;
  }

  const sourcePath = YOUTUBE_COOKIES_PATH;

  if (!fs.existsSync(sourcePath)) {
    return null;
  }

  const writablePath = "/tmp/youtube_cookies.txt";

  try {
    fs.copyFileSync(sourcePath, writablePath);
    return writablePath;
  } catch (error) {
    console.warn("YT-DLP: Failed to copy cookies:", error.message);

    return null;
  }
}

// =====================================================
// COMMON YT-DLP ARGUMENTS
// =====================================================

function getCommonArgs(url) {
  const args = [
    "--retries",
    "10",

    "--fragment-retries",
    "10",

    "--extractor-retries",
    "3",

    "--sleep-requests",
    "1",

    "--force-ipv4",
    "--js-runtimes",
    `deno:${DENO_PATH}`,
  ];

  let userAgent = null;

  // ---------------------------------------------
  // YouTube
  // ---------------------------------------------

  if (isYouTubeUrl(url)) {
    userAgent = YOUTUBE_USER_AGENT;
  }

  // ---------------------------------------------
  // Instagram
  // ---------------------------------------------
  else if (isInstagramUrl(url)) {
    userAgent = INSTAGRAM_USER_AGENT;
  }

  // ---------------------------------------------
  // Generic / future platforms
  // ---------------------------------------------
  else {
    userAgent = INSTAGRAM_USER_AGENT;
  }

  args.push("--user-agent", userAgent);

  // ---------------------------------------------
  // Cookies
  // ---------------------------------------------

  const cookiesPath = getWritableCookiesPath(url);

  if (cookiesPath) {
    args.push("--cookies", cookiesPath);
  }

  return {
    args,
    cookiesPath,
    userAgent,
  };
}

// =====================================================
// YT-DLP VERSION
// =====================================================

export async function getYtDlpVersion() {
  try {
    const { stdout, stderr } = await execFileAsync(YT_DLP_PATH, ["--version"], {
      timeout: 15_000,
    });

    const version = stdout?.trim();
    return version;
  } catch (error) {
    console.error("YT-DLP VERSION ERROR:", error.message);

    throw error;
  }
}

// =====================================================
// FFMPEG CHECK
// =====================================================

// =====================================================
// FFMPEG CHECK
// =====================================================

export async function checkFFmpeg() {
  try {
    // Make sure Linux binary is executable
    if (!isWindows && fs.existsSync(FFMPEG_PATH)) {
      try {
        fs.chmodSync(FFMPEG_PATH, 0o755);
      } catch (chmodError) {
        console.error("FFMPEG CHMOD ERROR:", chmodError.message);
      }
    }

    const { stdout, stderr } = await execFileAsync(FFMPEG_PATH, ["-version"], {
      timeout: 15_000,
    });

    const firstLine = stdout?.split("\n")?.[0]?.trim() || "UNKNOWN";
    return true;
  } catch (error) {
    console.error("FFMPEG ERROR:", error.message);
    return false;
  }
}

export async function getVideoInfo(url) {
  if (!url || typeof url !== "string") {
    throw new Error("A valid URL is required.");
  }

  const cleanUrl = url.trim();

  if (!cleanUrl) {
    throw new Error("URL cannot be empty.");
  }

  // ---------------------------------------------
  // FAST INFO ARGS
  // ---------------------------------------------
  const args = [
    "--dump-single-json",
    "--no-playlist",
    "--skip-download",

    // Don't make yt-dlp wait between requests.
    "--sleep-requests",
    "0",

    // Keep metadata failures reasonably fast.
    "--retries",
    "2",

    "--extractor-retries",
    "1",

    // Useful for Render/network environments.
    "--force-ipv4",
  ];

  // ---------------------------------------------
  // PLATFORM-SPECIFIC OPTIONS
  // ---------------------------------------------

  if (isYouTubeUrl(cleanUrl)) {
    args.push(
      "--js-runtimes",
      `deno:${DENO_PATH}`,
      "--user-agent",
      YOUTUBE_USER_AGENT,
    );

    const cookiesPath = getWritableCookiesPath(cleanUrl);

    if (cookiesPath) {
      args.push("--cookies", cookiesPath);
    }
  } else if (isInstagramUrl(cleanUrl)) {
    args.push("--user-agent", INSTAGRAM_USER_AGENT);
  }

  // ---------------------------------------------
  // URL
  // ---------------------------------------------

  args.push(cleanUrl);

  try {
    const { stdout, stderr } = await execFileAsync(YT_DLP_PATH, args, {
      maxBuffer: 50 * 1024 * 1024,
      timeout: 30_000,
      killSignal: "SIGKILL",
    });

    if (!stdout?.trim()) {
      throw new Error("yt-dlp returned empty media information.");
    }

    return JSON.parse(stdout);
  } catch (error) {
    console.error("YT-DLP INFO ERROR:", error.message);

    if (error.stderr) {
      console.error("YT-DLP STDERR:", error.stderr);
    }

    throw error;
  }
}

// =====================================================
// FORMAT SELECTOR
// =====================================================
function getFormatSelector(quality, mediaType) {
  if (mediaType === "audio") {
    return "bestaudio";
  }

  const videoOnlyGuard = "[vcodec!=none]";

  switch (quality) {
    case "1080p":
      return `bestvideo*[height<=1080]+bestaudio/best[height<=1080]${videoOnlyGuard}/bestvideo*+bestaudio/best${videoOnlyGuard}`;

    case "720p":
      return `bestvideo*[height<=720]+bestaudio/best[height<=720]${videoOnlyGuard}/bestvideo*+bestaudio/best${videoOnlyGuard}`;

    case "480p":
      return `bestvideo*[height<=480]+bestaudio/best[height<=480]${videoOnlyGuard}/bestvideo*+bestaudio/best${videoOnlyGuard}`;

    case "360p":
      return `bestvideo*[height<=360]+bestaudio/best[height<=360]${videoOnlyGuard}/bestvideo*+bestaudio/best${videoOnlyGuard}`;

    case "240p":
      return `bestvideo*[height<=240]+bestaudio/best[height<=240]${videoOnlyGuard}/bestvideo*+bestaudio/best${videoOnlyGuard}`;

    case "144p":
      return `bestvideo*[height<=144]+bestaudio/best[height<=144]${videoOnlyGuard}/bestvideo*+bestaudio/best${videoOnlyGuard}`;

    default:
      // This can never silently resolve to audio-only.
      return `bestvideo*+bestaudio/best${videoOnlyGuard}`;
  }
}

// =====================================================
// DOWNLOAD VIDEO / AUDIO
// =====================================================

export function downloadVideo({
  url,
  outputPath,
  quality = "best",
  format = "mp4",
  mediaType = "video",
}) {
  if (!url || typeof url !== "string") {
    throw new Error("Download URL is required.");
  }

  const cleanUrl = url.trim();

  if (!["video", "audio"].includes(mediaType)) {
    throw new Error(`Invalid mediaType: ${mediaType}`);
  }

  const { args: commonArgs, cookiesPath, userAgent } = getCommonArgs(cleanUrl);

  const args = [
    "--newline",

    "--no-playlist",

    "--ffmpeg-location",
    FFMPEG_PATH,

    ...commonArgs,
  ];

  // =================================================
  // AUDIO
  // =================================================

  if (mediaType === "audio") {
    args.push(
      "-f",
      "bestaudio",

      "-x",

      "--audio-format",
      format,

      "--audio-quality",
      "0",

      "-o",
      outputPath,
    );
  }

  // =================================================
  // VIDEO
  // =================================================
  else {
    const formatSelector = getFormatSelector(quality, "video");

    args.push(
      "-f",
      formatSelector,

      "-o",
      outputPath,

      "--merge-output-format",
      format,
    );
  }

  // =================================================
  // COMMON DOWNLOAD OPTIONS
  // =================================================

  args.push(
    "--continue",

    "--progress-template",
    "%(progress._percent_str)s|%(progress.speed)s|%(progress.eta)s",

    cleanUrl,
  );

  // =================================================
  // SPAWN
  // =================================================

  const process = spawn(YT_DLP_PATH, args, {
    stdio: ["ignore", "pipe", "pipe"],
  });

  // =================================================
  // PROCESS ERROR
  // =================================================

  process.on("error", (error) => {
    console.error("Message:", error.message);
    console.error("Code:", error.code);
  });

  process.stderr.on("data", (data) => {
    const message = data.toString().trim();

    if (message) {
      console.error("YT-DLP STDERR:", message);
    }
  });
  return process;
}
