import mongoose from "mongoose";
import Download from "../models/download.model.js";

export const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Counts
    const totalDownloads = await Download.countDocuments({ userId });

    const completedDownloads = await Download.countDocuments({
      userId,
      status: "completed",
    });

    const failedDownloads = await Download.countDocuments({
      userId,
      status: "failed",
    });

    const queuedDownloads = await Download.countDocuments({
      userId,
      status: "queued",
    });

    const downloadingDownloads = await Download.countDocuments({
      userId,
      status: "downloading",
    });

    const pausedDownloads = await Download.countDocuments({
      userId,
      status: "paused",
    });

    const platformUsage = await Download.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $group: {
          _id: "$platform",
          total: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
    ]);
    const downloadsThisWeek = await Download.aggregate([
      {
        $match: {
          userId,
          createdAt: {
            $gte: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          downloads: { $sum: 1 },
        },
      },
    ]);

    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const key = date.toISOString().split("T")[0];

      const found = downloadsThisWeek.find((d) => d._id === key);

      last7Days.push({
        day: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        downloads: found ? found.downloads : 0,
      });
    }

    const successRate =
      totalDownloads === 0
        ? 0
        : Number(((completedDownloads / totalDownloads) * 100).toFixed(1));
    const fileTypeDistribution = await Download.aggregate([
      {
        $match: { userId },
      },
      {
        $group: {
          _id: "$format",
          total: { $sum: 1 },
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
    ]);
    const recentActivity = await Download.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(8)
      .select("title status platform progress updatedAt");

    return res.status(200).json({
      success: true,
      data: {
        totalDownloads,
        completedDownloads,
        failedDownloads,
        queuedDownloads,
        downloadingDownloads,
        pausedDownloads,

        successRate,

        platformUsage,

        downloadsThisWeek: last7Days,

        fileTypeDistribution,

        recentActivity,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
