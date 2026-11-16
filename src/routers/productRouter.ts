import express from "express";
import { getAllProducts, createProduct } from "../controllers/productController";
import { authenticate } from "../middleware/auth";

const productRouter = express.Router();


productRouter.get("/", getAllProducts);
productRouter.post("/", authenticate, createProduct);

export default productRouter;