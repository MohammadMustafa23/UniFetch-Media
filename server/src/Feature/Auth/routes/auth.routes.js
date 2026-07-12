import express from 'express'
const AuthRouter = express.Router();
import { RegisterUser } from '../controllers/auth.controller.js';
import { validateRegister } from '../middleware/validateRegister.js';
AuthRouter.post('/register',validateRegister,RegisterUser)


export default AuthRouter;