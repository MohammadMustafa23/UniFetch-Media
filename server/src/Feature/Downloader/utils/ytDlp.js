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
// INITIAL LOG
// =====================================================

console.log("==============================================");
console.log("YT-DLP DOWNLOADER INITIALIZED");
console.log("==============================================");
console.log("YT-DLP PATH:", YT_DLP_PATH);
console.log("FFMPEG PATH:", FFMPEG_PATH);
console.log("Cookies configured:", Boolean(YT_COOKIES_PATH));
console.log("Cookies path:", YOUTUBE_COOKIES_PATH);
console.log("Platform:", process.platform);
console.log("==============================================");

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
    console.error(
      "YT-DLP: YouTube cookies file not found:",
      sourcePath
    );

    return null;
  }

  const writablePath = "/tmp/youtube_cookies.txt";

  try {
    fs.copyFileSync(sourcePath, writablePath);

    console.log(
      "YT-DLP: Cookies copied successfully:",
      writablePath
    );

    return writablePath;
  } catch (error) {
    console.error(
      "YT-DLP: Failed to copy cookies:",
      error.message
    );

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

    console.log("==============================================");
    console.log("YT-DLP VERSION:", version || "UNKNOWN");

    if (stderr?.trim()) {
      console.log("YT-DLP VERSION STDERR:", stderr.trim());
    }

    console.log("==============================================");

    return version;
  } catch (error) {
    console.error("YT-DLP VERSION ERROR:", error.message);

    throw error;
  }
}

// =====================================================
// FFMPEG CHECK
// =====================================================

export async function checkFFmpeg() {
  try {
    const { stdout, stderr } = await execFileAsync(FFMPEG_PATH, ["-version"], {
      timeout: 15_000,
    });

    const firstLine = stdout?.split("\n")?.[0]?.trim() || "UNKNOWN";

    console.log("FFMPEG:", firstLine);

    if (stderr?.trim()) {
      console.log("FFMPEG STDERR:", stderr.trim());
    }

    return true;
  } catch (error) {
    console.error("FFMPEG CHECK ERROR:", error.message);

    return false;
  }
}

// =====================================================
// GET VIDEO INFORMATION
// =====================================================

export async function getVideoInfo(url) {
  if (!url || typeof url !== "string") {
    throw new Error("A valid URL is required.");
  }

  const cleanUrl = url.trim();

  if (!cleanUrl) {
    throw new Error("URL cannot be empty.");
  }

  const { args: commonArgs, cookiesPath, userAgent } = getCommonArgs(cleanUrl);

  const args = [
    "--dump-single-json",

    "--no-playlist",

    "--skip-download",

    "--ffmpeg-location",
    FFMPEG_PATH,

    ...commonArgs,

    cleanUrl,
  ];

  console.log("==============================================");
  console.log("YT-DLP getVideoInfo");
  console.log("==============================================");
  console.log("URL:", cleanUrl);
  console.log(
    "Platform:",
    isYouTubeUrl(cleanUrl)
      ? "youtube"
      : isInstagramUrl(cleanUrl)
        ? "instagram"
        : "other",
  );
  console.log("Using cookies:", Boolean(cookiesPath));
  console.log("Cookies path:", cookiesPath || "NONE");
  console.log("User agent:", userAgent);
  console.log("==============================================");

  try {
    const { stdout, stderr } = await execFileAsync(YT_DLP_PATH, args, {
      maxBuffer: 50 * 1024 * 1024,

      timeout: 60_000,

      killSignal: "SIGKILL",
    });

    // -----------------------------------------
    // STDERR
    // -----------------------------------------

    if (stderr?.trim()) {
      console.log("YT-DLP getVideoInfo STDERR:", stderr.trim());
    }

    // -----------------------------------------
    // STDOUT
    // -----------------------------------------

    if (!stdout?.trim()) {
      throw new Error("yt-dlp returned empty media information.");
    }

    const data = JSON.parse(stdout);

    console.log("==============================================");
    console.log("YT-DLP INFO SUCCESS");
    console.log("==============================================");
    console.log("ID:", data.id);
    console.log("Title:", data.title);
    console.log("Extractor:", data.extractor);
    console.log("Duration:", data.duration);
    console.log(
      "Formats:",
      Array.isArray(data.formats) ? data.formats.length : 0,
    );
    console.log("==============================================");

    return data;
  } catch (error) {
    console.error("==============================================");
    console.error("YT-DLP getVideoInfo ERROR");
    console.error("==============================================");

    console.error("Message:", error.message);

    if (error.stdout) {
      console.error("STDOUT:", error.stdout);
    }

    if (error.stderr) {
      console.error("STDERR:", error.stderr);
    }

    console.error("==============================================");

    throw error;
  }
}

// =====================================================
// FORMAT SELECTOR
// =====================================================

function getFormatSelector(quality, mediaType) {
  // =============================================
  // AUDIO
  // =============================================

  if (mediaType === "audio") {
    return "bestaudio";
  }

  // =============================================
  // VIDEO
  // =============================================

  switch (quality) {
    case "1080p":
      return "bestvideo*[height<=1080]+bestaudio/" + "bestvideo*[height<=1080]";

    case "720p":
      return "bestvideo*[height<=720]+bestaudio/" + "bestvideo*[height<=720]";

    case "480p":
      return "bestvideo*[height<=480]+bestaudio/" + "bestvideo*[height<=480]";

    case "360p":
      return "bestvideo*[height<=360]+bestaudio/" + "bestvideo*[height<=360]";

    case "240p":
      return "bestvideo*[height<=240]+bestaudio/" + "bestvideo*[height<=240]";

    case "144p":
      return "bestvideo*[height<=144]+bestaudio/" + "bestvideo*[height<=144]";

    default:
      // IMPORTANT:
      //
      // Do NOT use:
      // bestvideo*+bestaudio/best
      //
      // because "best" can potentially select
      // an unwanted non-video format.
      //
      // This fallback always requires video.
      return "bestvideo*+bestaudio/bestvideo*";
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
  // LOG
  // =================================================

  console.log("==============================================");
  console.log("YT-DLP DOWNLOAD");
  console.log("==============================================");
  console.log("URL:", cleanUrl);
  console.log("Media Type:", mediaType);
  console.log("Quality:", quality);
  console.log("Format:", format);
  console.log("Using Cookies:", Boolean(cookiesPath));
  console.log("Cookies Path:", cookiesPath || "NONE");
  console.log("User Agent:", userAgent);
  console.log("Output:", outputPath);
  console.log("Arguments:");

  console.log(
    args
      .map((arg, index) => {
        return `${index}: ${arg}`;
      })
      .join("\n"),
  );

  console.log("==============================================");

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
    console.error("==============================================");

    console.error("YT-DLP PROCESS ERROR");

    console.error("==============================================");

    console.error("Message:", error.message);

    console.error("Code:", error.code);

    console.error("==============================================");
  });

  // =================================================
  // STDERR
  // =================================================

  process.stderr.on("data", (data) => {
    const message = data.toString().trim();

    if (message) {
      console.error("YT-DLP STDERR:", message);
    }
  });

  // =================================================
  // CLOSE
  // =================================================

  process.on("close", (code, signal) => {
    console.log("==============================================");

    console.log("YT-DLP PROCESS CLOSED");

    console.log("Exit Code:", code);

    console.log("Signal:", signal || "NONE");

    console.log("Media Type:", mediaType);

    console.log("Format:", format);

    console.log("==============================================");
  });

  return process;
}
