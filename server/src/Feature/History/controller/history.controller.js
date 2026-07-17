import {createHistoryService,getHistoryService} from "../service/history.service.js";

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

    const history = await getHistoryService(req.user._id, status);

    return res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}
