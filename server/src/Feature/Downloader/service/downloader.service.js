import { createDownload } from "../service/downloader.repository.js";

export async function createDownloadService(userId, downloadData) {
  const newDownload = await createDownload({
    userId,
    ...downloadData,
  });

  return newDownload;
}
