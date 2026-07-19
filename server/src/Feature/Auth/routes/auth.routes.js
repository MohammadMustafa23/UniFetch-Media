import express from 'express'
const AuthRouter = express.Router();
import { RegisterUser,LoginUser,GetCurrentUser,LogoutUser,GetUserProfile,ForgotPassword,ResetPassword,VerifyResetOTP } from '../controllers/auth.controller.js';
import { validateRegister } from '../middleware/validateRegister.js';
import { VerifyOTP } from '../controllers/auth.verifyOTP.js';
import { validateVerifyOTP } from '../middleware/validateVerifyOTP.js';
import {ResendOTP}  from '../utils/resendOTP.js';
import validateLogin from '../middleware/loginValidator.js';
import verifyJWT from '../middleware/verifyJWT.js';
import { googleLogin } from "../controllers/auth.controller.js";

AuthRouter.post('/auth/register',validateRegister,RegisterUser)
AuthRouter.post('/auth/verify-otp', validateVerifyOTP, VerifyOTP);
AuthRouter.post("/auth/resend-otp", ResendOTP);
AuthRouter.post('/auth/login',validateLogin,LoginUser)
AuthRouter.get('/auth/me',verifyJWT,GetCurrentUser)
AuthRouter.get('/auth/logout',verifyJWT,LogoutUser)
AuthRouter.get('/auth/profile',verifyJWT,GetUserProfile)

AuthRouter.post("/auth/forgot-password", ForgotPassword);
AuthRouter.post("/auth/verify-reset-otp", VerifyResetOTP);
AuthRouter.post("/auth/reset-password", ResetPassword);


AuthRouter.post('/auth/google',googleLogin)

export default AuthRouter;