import fs from "fs";
import path from "path";

export function findDownloadedFile(folder, title) {
  const files = fs.readdirSync(folder);

  const file = files.find((file) => file.startsWith(title));

  if (!file) return null;

  return path.join(folder, file);
}
