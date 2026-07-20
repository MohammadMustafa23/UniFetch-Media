import { Router } from "express";
import verifyJWT from "../../Auth/middleware/verifyJWT.js";

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
} from "../controller/notification.controller.js";

const NotificationRoute = Router();

NotificationRoute.get("/user/notification", verifyJWT, getNotifications);

NotificationRoute.patch("/user/read-all", verifyJWT, markAllAsRead);

NotificationRoute.patch("/user/:id/read", verifyJWT, markAsRead);

NotificationRoute.delete("/user/clear", verifyJWT, clearNotifications);

NotificationRoute.delete("/user/:id", verifyJWT, deleteNotification);

export default NotificationRoute;
