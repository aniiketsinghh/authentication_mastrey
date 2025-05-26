import express from 'express';
const router = express.Router();
import {signUp,login,logout,verifyEmail} from '../controllers/auth.controller.js';

router.post("/signup",signUp);
router.post("/login",login);
router.post("/logout",logout);

router.post("/verify-email",verifyEmail)



export default router