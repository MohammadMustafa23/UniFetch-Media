import express from "express";
import verifyJWT from "../../Auth/middleware/verifyJWT.js";
import { createHistory, getHistory } from "../controller/history.controller.js";
import {
  toggleFavorite,
  deleteHistory,
  downloadFromHistory,
  getFavorites
} from "../controller/ActionsButton.controller.js";
const HistoryRoute = express.Router();

HistoryRoute.post("/history/add", verifyJWT, createHistory);
HistoryRoute.get("/history/get", verifyJWT, getHistory);
HistoryRoute.patch("/history/favorite/:id", verifyJWT, toggleFavorite);
HistoryRoute.delete("/history/delete/:id", verifyJWT, deleteHistory);
HistoryRoute.post("/history/download/:id", verifyJWT, downloadFromHistory);
HistoryRoute.get("/history/favorites", verifyJWT, getFavorites);

export default HistoryRoute;
