import {createHistoryService,getHistoryService} from "../service/history.service.js";
import { redisClient } from "../../../config/redis.js";

export async function createHistory(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required.",
      });
    }

    const result = await createHistoryService(req.user._id, url);

    return res.status(200).json({
      success: true,
      alreadyExists: result.alreadyExists,
      data: result.history,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}

export async function getHistory(req, res) {
  try {
    const { status } = req.query;
    const userId = req.user._id;

    const cacheKey = `history:${userId}`;

    const cachedHistory = await redisClient.get(cacheKey);

    if (cachedHistory) {
      return res.status(200).json({
        success: true,
        data: cachedHistory,
      });
    }

    const history = await getHistoryService(userId, status);

    await redisClient.set(cacheKey, history, {
      ex: 60 * 2,
    });

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("[History] Get failed:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}