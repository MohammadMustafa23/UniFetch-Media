import History from "../models/history.model.js";

export async function createHistoryService({
  userId,
  url,
  platform,
  videoInfo,
}) {
  const existingHistory = await History.findOne({
    userId,
    url,
  });

  if (existingHistory) {
    return {
      alreadyExists: true,
      history: existingHistory,
    };
  }

  const history = await History.create({
    userId,
    url,
    platform,

    videoId: videoInfo.id,

    title: videoInfo.title,

    thumbnail: videoInfo.thumbnail,

    uploader: videoInfo.uploader?.name || "",

    duration: videoInfo.duration,

    type: videoInfo.type,

    availableQualities: videoInfo.qualities,

    bestQuality: videoInfo.qualities?.[0] || "",
  });

  return {
    alreadyExists: false,
    history,
  };
}

export async function getHistoryService(userId) {
  return History.find({ userId }).sort({ createdAt: -1 }).lean();
}
