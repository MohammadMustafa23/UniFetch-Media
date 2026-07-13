import express from 'express'
const AuthRouter = express.Router();
import { RegisterUser } from '../controllers/auth.controller.js';
import { validateRegister } from '../middleware/validateRegister.js';
import { VerifyOTP } from '../controllers/auth.verifyOTP.js';
import { validateVerifyOTP } from '../middleware/validateVerifyOTP.js';
import {ResendOTP}  from '../utils/resendOTP.js';

AuthRouter.post('/auth/register',validateRegister,RegisterUser)
AuthRouter.post('/auth/verify-otp', validateVerifyOTP, VerifyOTP);
AuthRouter.post("/auth/resend-otp", ResendOTP);

export default AuthRouter;