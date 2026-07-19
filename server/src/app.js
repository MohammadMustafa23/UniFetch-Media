import express, { json } from "express";
import AuthRouter from "./Feature/Auth/routes/auth.routes.js";
import PreferencesRouter from "./Feature/Preferences/routes/preferences.routes.js";
import DownloderRoute from "./Feature/Downloader/routes/downloader.routes.js";
import HistoryRoute from "./Feature/History/routes/history.routes.js";
import DownloadRoute from "./Feature/download/routes/download.routes.js";
import storageRoute from "../src/Feature/storage/storage.routes.js";
import VideoFuncRoute from "../src/Feature/VideoFunctions/playDownload.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_CLIENT_ID,
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", AuthRouter);
app.use("/api", PreferencesRouter);
app.use("/api", DownloderRoute);
app.use("/api", VideoFuncRoute);
app.use("/api", HistoryRoute);
app.use("/api", DownloadRoute);
app.use("/api", storageRoute);
export default app;
