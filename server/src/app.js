import express, { json } from 'express'
import AuthRouter from './Feature/Auth/routes/auth.routes.js';
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json())
app.use(cookieParser());

app.use('/api',AuthRouter);

export default app;