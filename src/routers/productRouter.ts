import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  scentQuiz,
} from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
router.post("/quiz", scentQuiz);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;