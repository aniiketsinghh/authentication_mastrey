import express from 'express';
const router = express.Router();
import {signUp,login,logout,verifyEmail, forgotPassword,resetPassword,checkAuth} from '../controllers/auth.controller.js';
import {verifyToken} from '../middleware/verifyToken.js';

router.get("/check-auth", verifyToken,checkAuth)

router.post("/signup",signUp);
router.post("/login",login);
router.post("/logout",logout);

router.post("/verify-email",verifyEmail)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);



export default router