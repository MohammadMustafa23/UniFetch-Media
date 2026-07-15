export function formatFileSize(bytes = 0) {
  if (!bytes) return "0 MB";

  const units = ["Bytes", "KB", "MB", "GB", "TB"];

  let i = 0;
  let size = bytes;

  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }

  return `${size.toFixed(1)} ${units[i]}`;
}
