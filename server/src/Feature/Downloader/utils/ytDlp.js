import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import { spawn } from "child_process";
const execFileAsync = promisify(execFile);

const BIN_DIR = path.resolve(process.cwd(), "bin");

const isWindows = process.platform === "win32";

const YT_DLP_PATH = isWindows
  ? path.join(BIN_DIR, "yt-dlp.exe")
  : path.join(BIN_DIR, "yt-dlp");

const FFMPEG_PATH = isWindows
  ? path.join(BIN_DIR, "ffmpeg.exe")
  : path.join(BIN_DIR, "ffmpeg");

export async function getVideoInfo(url) {
  if (!url || typeof url !== "string") {
    throw new Error("A valid URL is required.");
  }

  const cleanUrl = url.trim();

  const { stdout } = await execFileAsync(
    YT_DLP_PATH,
    [
      "--dump-single-json",
      "--no-playlist",
      "--no-warnings",
      "--skip-download",
      "--ffmpeg-location",
      FFMPEG_PATH,
      cleanUrl,
    ],
    {
      maxBuffer: 20 * 1024 * 1024,
      timeout: 60_000,
      killSignal: "SIGKILL",
    }
  );

  if (!stdout?.trim()) {
    throw new Error("Unable to fetch media information.");
  }

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
  const args = [
    "--newline",
    "--no-playlist",
    "--ffmpeg-location",
    FFMPEG_PATH,
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

  console.log("YT-DLP:", {
    mediaType,
    quality,
    format,
    args,
  });

  return spawn(YT_DLP_PATH, args);
}