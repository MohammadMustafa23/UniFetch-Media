import Download from "../models/download.model.js";

export async function getDownloads(req, res) {
  try {
    const downloads = await Download.find({
      userId: req.user._id,
      status: "completed",
    }).sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      message: "Downloads fetched successfully.",
      data: downloads,
    });
  } catch (error) {
    console.error("Get Downloads Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch downloads.",
    });
  }
}
