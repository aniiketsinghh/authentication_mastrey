import { User } from "../models/user.model.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail,sendWelcomeEmail,sendResetPassordEmail } from "../mailtrap/emails.js";


export const signUp=async(req,res)=>{
    try {
        const {email,password,name}=req.body

        if(!email|| !password|| !name){
           return res.status(404).json({message:"All fields are required"});
        }

        const userAlreadyExist=await User.findOne({email});
        if(userAlreadyExist){
          return res.status(404).json({success:false,message:"User already exist"});
        }
        const hashedPassword=await bcrypt.hash(password,10);

        const verificationToken=Math.floor(100000+Math.random()*900000).toString();

        const user= new User({
            email,
            password:hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt:Date.now()+24*60*60*1000 //24hr
        })

        await user.save();

        generateTokenAndSetCookie(res,user._id);

        await sendVerificationEmail(user.email,verificationToken);



        res.status(201).json({success:true,message:"User created successfully",
            user:{
                ...user._doc,
                password:undefined,
            },
        });
        
    } catch (error) {
        
    }
};
export const verifyEmail=async(req,res)=>{
    const {code}=req.body;
    try {
       const user= await User.findOne({
            verificationToken:code,
            verificationTokenExpiresAt:{$gt:Date.now()}
        })

        if(!user){
            return res.status(404).json({success:false,message:"Invalid or expired verification code"});
        }
        user.isVerified=true;
        user.verificationToken=undefined;
        user.verificationTokenExpiresAt=undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({success:true,message:"User verified successfully",
            user:{
                ...user._doc,
                password:undefined,
            },
        });
    } catch (error) {
        console.error("Error verifying otp email:", error);
        res.status(500).json({success:false,message:"Internal server error"});
    }
}
export const login=async(res,req)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({success:false,message:"All fields are required"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({success:false,message:"User not found"});
        }

        const isPasswordMatch=await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({success:false,message:"Invalid credentials"});
        }
        generateTokenAndSetCookie(res,user._id);
        user.lastLogin=new Date();

        res.status(200).json({success:true,message:"User logged in successfully",
            user:{
                ...user._doc,
                password:undefined,
            },
        })
}
    catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({success:false,message:"Internal server error"});
    }}

export const logout=async(req,res)=>{
    res.clearCookie("token");
    res.status(200).json({success:true,message:"logged out successfully"});
};
export const forgotPassword=async(req,res)=>{
    const {email}=req.body;
    try {
        if(!email){
            return res.status(400).json({success:false,message:"Email is required"});
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({success:false,message:"User not found"});
        }
        const resetToken=crypto.randomBytes(32).toString("hex");
        const resetTokenExpiresAt= Date.now() + 1 * 60 * 60 * 1000; 
        user.resetPasswordToken=resetToken;
        user.resetPasswordExpiresAt= resetTokenExpiresAt;
        await user.save();

        // Here you would send the reset password token to the user's email
        await sendResetPassordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({success:true,message:"Password reset email sent successfully"});
    }
    catch (error) {
        console.error("Error sending password reset email controller:", error);
        res.status(500).json({message:"Internal server error in forgotPassword controller"});
    }}

export const resetPassword=async(req,res)=>{
    
}