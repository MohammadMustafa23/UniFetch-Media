import { Router } from "express";
import  verifyJWT  from "../../Auth/middleware/verifyJWT.js";
import { createDownload } from "../controller/download.controller.js";
import { getDownloads } from "../controller/getDownloads.controller.js";
import { getQueue } from "../controller/getQueue.controller.js";
import { autoDownload } from "../controller/autoDownload.controller.js";

const DownloadRoute = Router();

DownloadRoute.post("/download/start", verifyJWT, createDownload);
DownloadRoute.get("/download/downloads", verifyJWT, getDownloads);
DownloadRoute.get("/download/queue", verifyJWT, getQueue);
DownloadRoute.post('/download/autoDownload',verifyJWT,autoDownload)

export default DownloadRoute;