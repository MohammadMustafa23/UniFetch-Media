import { Router } from "express";
import verifyJWT from "../../Auth/middleware/verifyJWT.js";

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
} from "../controller/notification.controller.js";
import { notificationActionLimiter } from "../ratelimit/notificationRateLimiter.js";
const NotificationRoute = Router();

NotificationRoute.get("/user/notification", verifyJWT, getNotifications);

NotificationRoute.patch(
  "/user/read-all",
  verifyJWT,
  notificationActionLimiter,
  markAllAsRead,
);

NotificationRoute.patch(
  "/user/:id/read",
  verifyJWT,
  notificationActionLimiter,
  markAsRead,
);

NotificationRoute.delete(
  "/user/clear",
  verifyJWT,
  notificationActionLimiter,
  clearNotifications,
);

NotificationRoute.delete(
  "/user/:id",
  verifyJWT,
  notificationActionLimiter,
  deleteNotification,
);
export default NotificationRoute;
