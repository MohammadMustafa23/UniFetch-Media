import dotenv from "dotenv";
dotenv.config();


import app from './src/app.js'
import connectDB from "./src/db/db.connection.js";
import { connectRedis } from "./src/config/redis.js";

connectDB();

// Redis Connection
connectRedis();

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server Runing on PORT : ${PORT}`);
})