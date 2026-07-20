import Notification from "../models/notification.model.js";

export async function createNotification({
  userId,
  title,
  message,
  type = "info",
  metadata = {},
}) {
  const notification = await Notification.create({
    userId,
    title,
    message,
    type,
    metadata,
  });

  return notification;
}
