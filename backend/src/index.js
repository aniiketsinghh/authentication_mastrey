import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";



const PORT = process.env.PORT || 5001;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes)

connectDB().then(() => {
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
});