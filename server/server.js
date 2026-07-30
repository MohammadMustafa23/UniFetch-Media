import dotenv from "dotenv";
dotenv.config();


import app from './src/app.js'
import connectDB from "./src/db/db.connection.js";
import { connectRedis } from "./src/config/redis.js";
import { recoverDownloads } from "./src/Feature/download/utils/recoverDownloads.js";
import http from "http";
import { initSocket } from "./src/socket/socket.js";

connectDB();
// Redis Connection
connectRedis();
// Recover Downlaod
await recoverDownloads();



const PORT = process.env.PORT;
const server = http.createServer(app);
initSocket(server);


server.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server Running on Port", PORT);
  console.log("📡 Socket.IO Initialized");
});