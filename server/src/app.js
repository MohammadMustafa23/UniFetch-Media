import express, { json } from 'express'
import AuthRouter from './Feature/Auth/routes/auth.routes.js';

const app = express();

app.use(express.json())


app.use('/auth',AuthRouter);

export default app;