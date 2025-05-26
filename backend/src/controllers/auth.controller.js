import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";


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
export const login=async()=>{};
export const logout=async()=>{};