import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRouter from "./routes/user.route.js";
import { app, server } from "./socket/index.js";
dotenv.config();
// const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

const PORT = 8081 || process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello, Node");
});

app.use("/user", userRouter);

connectDB().then(() => {
});

