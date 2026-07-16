import { Router } from "express";
import  verifyJWT  from "../../Auth/middleware/verifyJWT.js";
import { createDownload } from "../controller/download.controller.js";
import { getDownloads } from "../controller/getDownloads.controller.js";
import { getQueue } from "../controller/getQueue.controller.js";

const DownloadRoute = Router();

DownloadRoute.post("/download/start", verifyJWT, createDownload);
DownloadRoute.get("/download/downloads", verifyJWT, getDownloads);
DownloadRoute.get("/download/queue", verifyJWT, getQueue);

export default DownloadRoute;