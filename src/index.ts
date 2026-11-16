import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routers/authRouter";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRouter);

mongoose.connect(process.env.MONGO_URI || "").then(() => {
  console.log("Database connected..!")
  app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port 5000..!");
  });
});
