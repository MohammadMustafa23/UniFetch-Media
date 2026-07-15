import express from "express";
import verifyJWT from "../../Auth/middleware/verifyJWT.js";
import { createHistory, getHistory } from "../controller/history.controller.js";

const HistoryRoute = express.Router();

HistoryRoute.post("/history/add", verifyJWT, createHistory);
HistoryRoute.get("/history/get", verifyJWT, getHistory);

export default HistoryRoute;
