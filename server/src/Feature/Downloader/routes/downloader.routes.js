import { Router } from "express";
import verifyJWT from "../../Auth/middleware/verifyJWT.js";

import { getDownloadInfo } from "../controller/downloader.controller.js";

const DownloderRoute = Router();

DownloderRoute.post("/download/info", verifyJWT, getDownloadInfo);

export default DownloderRoute;
