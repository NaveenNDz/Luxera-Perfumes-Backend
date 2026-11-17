import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import productRouter from "./routers/productRouter";
import authRouter from "./routers/authRouter";
import orderRouter from "./routers/orderRouter";
import reviewRouter from "./routers/reviewRouter";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/luxera";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully to LUXERA Database");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database connection error:", error);
  });

app.use("/api/products", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/orders", orderRouter);
app.use("/api/reviews", reviewRouter);

app.get("/", (req, res) => {
  res.send("LUXERA API Server is Running Successfully");
});
