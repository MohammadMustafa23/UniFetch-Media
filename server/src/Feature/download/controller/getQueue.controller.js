// getQueue.controller.js

import Download from "../models/download.model.js";

export async function getQueue(req, res) {
  try {
    const downloads = await Download.find({
      userId: req.user._id,
      status: {
        $in: ["queued", "downloading", "paused", "failed", "canceled"],
      },
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Queue fetched successfully.",
      data: downloads,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch queue.",
    });
  }
}
