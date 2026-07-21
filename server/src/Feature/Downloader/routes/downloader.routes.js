import { Router } from "express";
import verifyJWT from "../../Auth/middleware/verifyJWT.js";

import { getDownloadInfo } from "../controller/downloader.controller.js";
import { downloadInfoLimiter } from "../../download/ratelimit/downloadRateLimiter.js";
const DownloderRoute = Router();

DownloderRoute.post("/download/info",downloadInfoLimiter ,verifyJWT, getDownloadInfo);

export default DownloderRoute;
