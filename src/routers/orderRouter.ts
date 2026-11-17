import { Router } from "express";
import {
  getOrders,
  createOrder,
  updateOrder,
  getCustomers,
} from "../controllers/orderController";

const router = Router();

router.get("/customers", getCustomers);
router.get("/", getOrders);
router.post("/", createOrder);
router.put("/:id", updateOrder);

export default router;
