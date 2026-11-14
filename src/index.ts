import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import AuthRouter from "./routers/authRouter"; // Login/Register ටික විතරක්

dotenv.config();

const app = express();
const mongodbURI = process.env.MONGO_URI || "";
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("LUXERA Perfume API Running...");
});

// දැනට තියෙන්නේ මේක විතරයි
app.use("/api/v1/auth", AuthRouter); 

mongoose
  .connect(mongodbURI)
  .then(() => {
    console.log("Connected to MongoDB...");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log("MongoDB Error:", error));
