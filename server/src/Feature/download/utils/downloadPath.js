import fs from "fs";
import path from "path";

export function createDownloadPath(userId, platform) {
  const folder = path.join(
    process.cwd(),
    "downloads",
    userId.toString(),
    platform,
  );

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  return folder;
}
