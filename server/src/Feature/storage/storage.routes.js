import { Router } from "express";
import  verifyJWT from "../Auth/middleware/verifyJWT.js";
import {getStorage,clearCache,removeFailedDownloads} from "../storage/storage.controller.js";

const storageRoute = Router();

storageRoute.get("/storage", verifyJWT, getStorage);
storageRoute.delete("/storage/failed", verifyJWT, clearCache);
storageRoute.delete("/storage/failed", verifyJWT, removeFailedDownloads);

export default storageRoute;
