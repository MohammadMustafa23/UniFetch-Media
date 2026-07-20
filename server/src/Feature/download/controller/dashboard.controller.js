import Download from "../models/download.model.js";
import fs from "fs";
import { formatFileSize } from "../utils/formatFileSize.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalDownloads,
      activeDownloads,
      completedDownloads,
      todayDownloads,
      liveQueue,
      recentDownloads,
      completedFiles,
    ] = await Promise.all([
      Download.countDocuments({ userId }),

      Download.countDocuments({
        userId,
        status: {
          $in: ["queued", "downloading", "paused"],
        },
      }),

      Download.countDocuments({
        userId,
        status: "completed",
      }),

      Download.countDocuments({
        userId,
        createdAt: {
          $gte: today,
        },
      }),

      Download.find({
        userId,
        status: {
          $in: ["queued", "downloading", "paused"],
        },
      })
        .sort({ createdAt: -1 })
        .limit(5),

      Download.find({
        userId,
        status: "completed",
      })
        .sort({ updatedAt: -1 })
        .limit(5),

      Download.find({
        userId,
        status: "completed",
      }).select("filePath"),
    ]);

    let totalBytes = 0;
    let todayBytes = 0;

    for (const file of completedFiles) {
      if (file.filePath && fs.existsSync(file.filePath)) {
        totalBytes += fs.statSync(file.filePath).size;
      }
    }

    for (const file of recentDownloads) {
      if (
        file.createdAt >= today &&
        file.filePath &&
        fs.existsSync(file.filePath)
      ) {
        todayBytes += fs.statSync(file.filePath).size;
      }
    }

    const successRate =
      totalDownloads === 0
        ? 0
        : Number(
            (
              (completedDownloads / totalDownloads) *
              100
            ).toFixed(1)
          );

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalDownloads,
          todayDownloads,
          activeDownloads,
          completedDownloads,
          successRate,
          storageUsed: formatFileSize(totalBytes),
          storageLimit: "2 GB",
        },

        today: {
          downloads: todayDownloads,
          bandwidth: formatFileSize(todayBytes),
        },

        liveQueue,

        recentDownloads,

        latestUpdates: [],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};