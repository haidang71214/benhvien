import express from 'express';
import { extendToken, forgotPassword, login, loginFacebook, logout, register, resetPassword, updateMyself } from '../controllers/auth.js';
import { middlewareTokenAsyncKey } from '../config/jwt.js';
import { uploadCloud } from '../config/uploadCloud.js';


const authRouter = express.Router();
authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/loginFace',loginFacebook);
authRouter.post('/extendToken',extendToken);
authRouter.post('/forgotPassword',forgotPassword);
authRouter.post('/resetPassword',resetPassword);
authRouter.post('/logout',logout);
authRouter.post('/updateMyself',middlewareTokenAsyncKey,uploadCloud.single('img'),updateMyself);
export default authRouter; 