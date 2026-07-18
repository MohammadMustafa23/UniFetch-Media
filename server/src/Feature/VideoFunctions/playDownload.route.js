import express from "express";
import verifyJWT from "../Auth/middleware/verifyJWT.js";

import { playDownload, saveDownload,deleteDownload } from "./playDownload.controller.js";

const VideoFuncRoute = express.Router();

VideoFuncRoute.get("/download/play/:id", verifyJWT, playDownload);
VideoFuncRoute.get("/download/save/:id", verifyJWT, saveDownload);
VideoFuncRoute.delete("/download/delete/:id", verifyJWT, deleteDownload);

export default VideoFuncRoute;
