import express, { json } from 'express'
import AuthRouter from './Feature/Auth/routes/auth.routes.js';

const app = express();

import cors from "cors";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json())


app.use('/api',AuthRouter);

export default app;