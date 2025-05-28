import express from 'express';
import { extendToken, forgotPassword, login, loginFacebook, logout, register, resetPassword, updateMyself } from '../controllers/auth.js';
import { middlewareTokenAsyncKey } from '../config/jwt.js';
import { uploadCloud } from '../config/uploadCloud.js';


const authRouter = express.Router();
authRouter.post('/register',register); // đăng kí
authRouter.post('/login',login); // đăng nhập
authRouter.post('/loginFace',loginFacebook); // loginfb
authRouter.post('/extendToken',extendToken); // extendToken
authRouter.post('/forgotPassword',forgotPassword); // forgotpass
authRouter.post('/resetPassword',resetPassword); // resetPass after forgot
authRouter.post('/logout',logout); // logout
authRouter.post('/updateMyself',middlewareTokenAsyncKey,uploadCloud.single('img'),updateMyself); // update myself
export default authRouter; 