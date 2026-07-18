import fs from "fs";
import path from "path";

export function getFolderSize(folderPath) {
  if (!fs.existsSync(folderPath)) {
    return 0;
  }

  let total = 0;

  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);

    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      total += getFolderSize(filePath);
    } else {
      total += stats.size;
    }
  }

  return total;
}
