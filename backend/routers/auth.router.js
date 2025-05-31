import express from 'express';
import { extendToken, forgotPassword, login, loginFacebook, logout, register, verifyEmail, resetPassword, updateMyself } from '../controllers/auth.js';
import { middlewareTokenAsyncKey } from '../config/jwt.js';
import { uploadCloud } from '../config/uploadCloud.js';
import passport from 'passport';
import { createTokenAsyncKey } from '../config/jwt.js';

const authRouter = express.Router();
authRouter.post('/register',register); // đăng kí
authRouter.post('/verifyEmail',verifyEmail); // verify email
authRouter.post('/login',login); // đăng nhập
authRouter.post('/loginFace',loginFacebook); // loginfb
authRouter.post('/extendToken',extendToken); // extendToken
authRouter.post('/forgotPassword',forgotPassword); // forgotpass
authRouter.post('/resetPassword',resetPassword); // resetPass after forgot
authRouter.post('/logout',logout); // logout
authRouter.post('/updateMyself',middlewareTokenAsyncKey,uploadCloud.single('img'),updateMyself); // update myself
authRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    const token = await createTokenAsyncKey({
      id: req.user._id,
      userName: req.user.userName,
      role: req.user.role,
      avatarUrl: req.user.avatarUrl,
      email: req.user.email,
    });
    res.redirect(
      `http://localhost:5173/login-success?token=${token}&id=${req.user._id}&userName=${encodeURIComponent(req.user.userName)}&role=${req.user.role}&avatarUrl=${encodeURIComponent(req.user.avatarUrl || "")}&email=${encodeURIComponent(req.user.email)}&isVerified=${req.user.isVerified}`
    );
  }
);

export default authRouter;