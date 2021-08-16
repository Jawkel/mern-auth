import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import conn from "./db.js";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoute.js";

dotenv.config();

const app = express();

// Integrated middlewares that parse both json and urlencoded.
app.use(express.json({limit: "10mb", extended: true}));
app.use(express.urlencoded({limit: "10mb", extended: true}));

app.use(cors({credentials: true, origin: `http://localhost:${process.env.CLIENT_PORT}`}));
app.use(cookieParser());

app.use('/user', userRoutes);


conn(() => app.listen(process.env.PORT, () => console.log(`Server Running on Port: http://localhost:${process.env.PORT}`)));