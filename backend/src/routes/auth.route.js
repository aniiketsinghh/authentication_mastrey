import express from 'express';
const router = express.Router();
import {signUp,login,logout,verifyEmail, forgotPassword,resetPassword} from '../controllers/auth.controller.js';

router.post("/signup",signUp);
router.post("/login",login);
router.post("/logout",logout);

router.post("/verify-email",verifyEmail)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);



export default router