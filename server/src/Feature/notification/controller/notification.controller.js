import mongoose from "mongoose";
import Notification from "../models/notification.model.js";
import { redisClient } from "../../../config/redis.js";

/* ==========================================================
   GET NOTIFICATIONS
========================================================== */

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const versionKey = `notifications:version:${userId}`;
    let version = await redisClient.get(versionKey);

    if (!version) {
      version = 1;
      await redisClient.set(versionKey, version);
    }

    
    const cacheKey = `notifications:${userId}:${version}:${page}:${limit}`;
    // ==========================
    // Redis Cache
    // ==========================

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json({
        success: true,
        ...cached,
      });
    }

    // ==========================
    // Mongo Queries
    // ==========================

    const [notifications, unread, total] = await Promise.all([
      Notification.find({ userId })
        .sort({
          isRead: 1, // Unread (false) first
          createdAt: -1, // Latest first
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Notification.countDocuments({
        userId,
        isRead: false,
      }),

      Notification.countDocuments({
        userId,
      }),
    ]);

    const payload = {
      notifications,
      unread,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };

    await redisClient.set(cacheKey, payload, {
      ex: 300,
    });

    return res.status(200).json({
      success: true,
      ...payload,
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
    });
  }
};


/* ==========================================================
   MARK AS READ
========================================================== */

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification id.",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: id,
        userId: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
      },
      {
        new: true,
      },
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      notification,
    });
  } catch (error) {
    console.error("Mark As Read Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update notification.",
    });
  }
};

/* ==========================================================
   MARK ALL AS READ
========================================================== */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Notification.updateMany(
      {
        userId,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    // Invalidate all notification cache pages
    if (result.modifiedCount > 0) {
      await redisClient.incr(`notifications:version:${userId}`);
    }

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
      modifiedCount: result.modifiedCount,
    });

  } catch (error) {
    console.error("Mark All Read Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update notifications.",
    });
  }
};

/* ==========================================================
   DELETE NOTIFICATION
========================================================== */

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification id.",
      });
    }

    const notification = await Notification.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    // Invalidate all notification cache pages
    await redisClient.incr(`notifications:version:${userId}`);

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
      notification,
    });

  } catch (error) {
    console.error("Delete Notification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification.",
    });
  }
};

/* ==========================================================
   CLEAR ALL NOTIFICATIONS
========================================================== */
export const clearNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Notification.deleteMany({
      userId,
    });

    // Invalidate all notification cache pages
    await redisClient.incr(`notifications:version:${userId}`);

    return res.status(200).json({
      success: true,
      message: "All notifications cleared successfully.",
      deletedCount: result.deletedCount,
    });

  } catch (error) {
    console.error("Clear Notifications Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to clear notifications.",
    });
  }
};
