import Download from "../../download/models/download.model.js";
import History from "../models/history.model.js";

export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(200).json({
        downloads: [],
        history: [],
      });
    }

    const search = new RegExp(q, "i");

    const downloads = await Download.find({
      userId: req.user._id,
      $or: [
        { title: search },
        { uploader: search },
        { url: search },
        { platform: search },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const history = await History.find({
      userId: req.user._id,
      $or: [
        { title: search },
        { uploader: search },
        { url: search },
        { platform: search },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      downloads,
      history,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Search failed.",
    });
  }
};
