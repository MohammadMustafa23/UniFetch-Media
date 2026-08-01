import Notification from "../models/notification.model.js";
import { redisClient } from "../../../config/redis.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const cacheKey = `notifications:${userId}`;

    // ==========================
    // Check Redis Cache
    // ==========================
    const cachedNotifications = await redisClient.get(cacheKey);

    if (cachedNotifications) {
      return res.status(200).json({
        success: true,
        notifications: cachedNotifications,
      });
    }

    // ==========================
    // Fetch from MongoDB
    // ==========================
    const notifications = await Notification.find({
      userId,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // ==========================
    // Save to Redis (1 Minute)
    // ==========================
    await redisClient.set(cacheKey, notifications, {
      ex: 60,
    });

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
    });
  }
};

export const markAsRead = async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findOneAndUpdate(
    {
      _id: id,
      userId: req.user._id,
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

  await redisClient.del(`notifications:${req.user._id}`);

  res.status(200).json({
    success: true,
    notification,
  });
};

export const markAllAsRead = async (req, res) => {
  await Notification.updateMany(
    {
      userId: req.user._id,
      isRead: false,
    },
    {
      isRead: true,
    },
  );

  await redisClient.del(`notifications:${req.user._id}`);
  res.status(200).json({
    success: true,
    message: "All notifications marked as read.",
  });
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findOneAndDelete({
    _id: id,
    userId: req.user._id,
  });

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found.",
    });
  }

  await redisClient.del(`notifications:${req.user._id}`);

  res.status(200).json({
    success: true,
    message: "Notification deleted.",
  });
};

export const clearNotifications = async (req, res) => {
  await Notification.deleteMany({
    userId: req.user._id,
  });

  await redisClient.del(`notifications:${req.user._id}`);

  res.status(200).json({
    success: true,
    message: "All notifications cleared.",
  });
};
