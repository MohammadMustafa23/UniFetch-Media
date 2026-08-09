import dotenv from "dotenv";
dotenv.config();


import app from './src/app.js'
import connectDB from "./src/db/db.connection.js";
import { connectRedis } from "./src/config/redis.js";
import { recoverDownloads } from "./src/Feature/download/utils/recoverDownloads.js";
import http from "http";
import { initSocket } from "./src/socket/socket.js";
import { checkFFmpeg } from "./src/Feature/Downloader/utils/ytDlp.js";

connectDB();
// Redis Connection
connectRedis();
// Recover Downlaod
await recoverDownloads();



const PORT = process.env.PORT;
const server = http.createServer(app);
initSocket(server);


server.listen(PORT, () => {
  console.log("🚀 Server Running on Port", PORT);
  await checkFFmpeg();
});