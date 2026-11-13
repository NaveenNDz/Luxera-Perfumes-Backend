import express, { Request , Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routers/authRouter.js";
import AuthRouter from "./routers/authRouter";

dotenv.config();

const app = express();

const mongodbURI = process.env.MONGO_URI || "";
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Luxera Perfume API Running...");
});

app.use("/api/v1/auth", AuthRouter);

mongoose
  .connect(mongodbURI)
  .then(() => {
    console.log("Connected to MongoDB...");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Error :", error);
  });

app.use("/api/users", userRouter);
