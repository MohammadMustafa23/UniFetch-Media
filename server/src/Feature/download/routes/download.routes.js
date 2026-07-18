import { Router } from "express";
import  verifyJWT  from "../../Auth/middleware/verifyJWT.js";
import { createDownload } from "../controller/download.controller.js";
import { getDownloads } from "../controller/getDownloads.controller.js";
import { getQueue } from "../controller/getQueue.controller.js";
import { autoDownload } from "../controller/autoDownload.controller.js";4
import {retryDownload,pauseDownload,resumeDownload,cancelDownload} from '../controller/download.function.js'
import {getDashboardAnalytics} from "../controller/analytics.controller.js";

const DownloadRoute = Router();

DownloadRoute.post("/download/start", verifyJWT, createDownload);
DownloadRoute.get("/download/downloads", verifyJWT, getDownloads);
DownloadRoute.get("/download/queue", verifyJWT, getQueue);
DownloadRoute.post('/download/autoDownload',verifyJWT,autoDownload)
DownloadRoute.post("/download/retry/:id", verifyJWT, retryDownload);
DownloadRoute.post("/download/pause/:id", verifyJWT, pauseDownload);
DownloadRoute.post("/download/resume/:id", verifyJWT, resumeDownload);
DownloadRoute.delete("/download/delete/:id", verifyJWT, cancelDownload);
DownloadRoute.get("/analytics/dashboard", verifyJWT, getDashboardAnalytics);


export default DownloadRoute;