import dotenv from "dotenv";
dotenv.config();


import app from './src/app.js'
import connectDB from "./src/db/db.connection.js";
import { connectRedis } from "./src/config/redis.js";
import { recoverDownloads } from "./src/Feature/download/utils/recoverDownloads.js";

connectDB();
// Redis Connection
connectRedis();
// Recover Downlaod
await recoverDownloads();



const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server Runing on PORT : ${PORT}`);
})