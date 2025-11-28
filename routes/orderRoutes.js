import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";
import { protect, isSeller, isCustomer } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, isCustomer, createOrder);
router.get("/", protect, getAllOrders);
router.get("/:id", protect, getOrderById);

router.put("/:id/cancel", protect, isCustomer, cancelOrder);

router.put("/:id/status", protect, isSeller, updateOrderStatus);

export default router;
