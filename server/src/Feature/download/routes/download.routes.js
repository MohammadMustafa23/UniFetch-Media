import { Router } from "express";
import  verifyJWT  from "../../Auth/middleware/verifyJWT.js";
import { createDownload } from "../controller/download.controller.js";
import { getDownloads } from "../controller/getDownloads.controller.js";
import { getQueue } from "../controller/getQueue.controller.js";
import { autoDownload } from "../controller/autoDownload.controller.js";4
import {retryDownload,pauseDownload,resumeDownload,cancelDownload} from '../controller/download.function.js'
import {getDashboardAnalytics} from "../controller/analytics.controller.js";
import {getDashboard} from '../controller/dashboard.controller.js'
import { downloadLimiter,queueActionLimiter } from "../ratelimit/downloadRateLimiter.js";

const DownloadRoute = Router();

DownloadRoute.post("/download/start",verifyJWT,downloadLimiter,createDownload);
DownloadRoute.get("/download/downloads",verifyJWT, getDownloads);
DownloadRoute.get("/download/queue",verifyJWT, getQueue);
DownloadRoute.post("/download/autoDownload",verifyJWT,downloadLimiter,autoDownload);
DownloadRoute.post("/download/retry/:id",verifyJWT,queueActionLimiter,retryDownload);
DownloadRoute.post("/download/pause/:id",verifyJWT,queueActionLimiter,pauseDownload);

DownloadRoute.post(
  "/download/resume/:id",
  verifyJWT,
  queueActionLimiter,
  resumeDownload
);

DownloadRoute.delete(
  "/download/delete/:id",
  verifyJWT,
  queueActionLimiter,
  cancelDownload
);

DownloadRoute.get("/analytics/dashboard", verifyJWT, getDashboardAnalytics);
DownloadRoute.get("/user/dashboard", verifyJWT, getDashboard);

export default DownloadRoute;