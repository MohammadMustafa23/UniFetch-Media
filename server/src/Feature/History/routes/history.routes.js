import express from "express";
import verifyJWT from "../../Auth/middleware/verifyJWT.js";
import { createHistory, getHistory } from "../controller/history.controller.js";
import {
  toggleFavorite,
  deleteHistory,
  downloadFromHistory,
  getFavorites,
} from "../controller/ActionsButton.controller.js";
import {historyDownloadLimiter,historyWriteLimiter} from '../rateLimit/historyRateLimiter.js'
const HistoryRoute = express.Router();

HistoryRoute.post(
  "/history/add",
  verifyJWT,
  historyWriteLimiter,
  createHistory,
);

HistoryRoute.get("/history/get", verifyJWT, getHistory);

HistoryRoute.patch(
  "/history/favorite/:id",
  verifyJWT,
  historyWriteLimiter,
  toggleFavorite,
);

HistoryRoute.delete(
  "/history/delete/:id",
  verifyJWT,
  historyWriteLimiter,
  deleteHistory,
);

HistoryRoute.post(
  "/history/download/:id",
  verifyJWT,
  historyDownloadLimiter,
  downloadFromHistory,
);

HistoryRoute.get("/history/favorites", verifyJWT, getFavorites);

export default HistoryRoute;
