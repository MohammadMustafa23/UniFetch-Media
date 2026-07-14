import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";

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
