import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({
    userId: req.user._id,
  })
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json({
    success: true,
    notifications,
  });
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

  res.status(200).json({
    success: true,
    message: "Notification deleted.",
  });
};

export const clearNotifications = async (req, res) => {
  await Notification.deleteMany({
    userId: req.user._id,
  });

  res.status(200).json({
    success: true,
    message: "All notifications cleared.",
  });
};
