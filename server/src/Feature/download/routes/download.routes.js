import { Router } from "express";
import  verifyJWT  from "../../Auth/middleware/verifyJWT.js";
import { createDownload } from "../controller/download.controller.js";
import { getDownloads } from "../controller/getDownloads.controller.js";


const DownloadRoute = Router();

DownloadRoute.post("/download/start", verifyJWT, createDownload);
DownloadRoute.get("/download/downloads", verifyJWT, getDownloads);
export default DownloadRoute;