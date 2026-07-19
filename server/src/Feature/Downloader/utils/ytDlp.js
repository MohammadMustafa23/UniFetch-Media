import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import { spawn } from "child_process";
const execFileAsync = promisify(execFile);

const BIN_DIR = path.resolve(process.cwd(), "bin");

const YT_DLP_PATH = path.join(BIN_DIR, "yt-dlp.exe");

const FFMPEG_PATH = path.join(BIN_DIR, "ffmpeg.exe");

export async function getVideoInfo(url) {
  const { stdout } = await execFileAsync(YT_DLP_PATH, [
    "-J",
    "--no-playlist",
    "--ffmpeg-location",
    FFMPEG_PATH,
    url,
  ]);

  return JSON.parse(stdout);
}

function getFormatSelector(quality, type) {
  // Audio Only
  if (type === "audio") {
    return "bestaudio/best";
  }

  switch (quality) {
    case "1080p":
      return "bestvideo[height<=1080]+bestaudio/best[height<=1080]";

    case "720p":
      return "bestvideo[height<=720]+bestaudio/best[height<=720]";

    case "480p":
      return "bestvideo[height<=480]+bestaudio/best[height<=480]";

    case "360p":
      return "bestvideo[height<=360]+bestaudio/best[height<=360]";

    case "240p":
      return "bestvideo[height<=240]+bestaudio/best[height<=240]";

    case "144p":
      return "bestvideo[height<=144]+bestaudio/best[height<=144]";

    default:
      return "bestvideo+bestaudio/best";
  }
}

export function downloadVideo({
  url,
  outputPath,
  quality = "best",
  format = "mp4",
  type = "video",
}) {
  const args = ["--newline", "--no-playlist", "--ffmpeg-location", FFMPEG_PATH];

  // ============================
  // AUDIO DOWNLOAD
  // ============================
  if (type === "audio" || format === "mp3") {
    args.push(
      "-f",
      "bestaudio/best",

      "-x",

      "--audio-format",
      "mp3",

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

  // ✅ Add here
  args.push(
    "--progress-template",
    "%(progress._percent_str)s|%(progress.speed)s|%(progress.eta)s",
  );

  // URL should always be last
  args.push(url);

  console.log("yt-dlp args:", args);

  return spawn(YT_DLP_PATH, args);
}
