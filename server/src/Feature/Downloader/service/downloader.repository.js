import Download from "../models/downloader.model.js";

/**
 * Create a new download
 */
export async function createDownload(downloadData) {
  return await Download.create(downloadData);
}

/**
 * Find download by ID
 */
export async function findDownloadById(downloadId) {
  return await Download.findById(downloadId);
}

/**
 * Get all downloads of a user
 */
export async function findDownloadsByUserId(userId) {
  return await Download.find({ userId }).sort({
    createdAt: -1,
  });
}

/**
 * Update download
 */
export async function updateDownload(downloadId, updateData) {
  return await Download.findByIdAndUpdate(downloadId, updateData, {
    new: true,
    runValidators: true,
  });
}

/**
 * Delete download
 */
export async function deleteDownload(downloadId) {
  return await Download.findByIdAndDelete(downloadId);
}
