import express from "express";
import {
  createCoupon,
  getAllCoupons,
  getActiveCoupons,
  validateCoupon,
  getCouponById,
  updateCoupon,
  deleteCoupon
} from "../controllers/couponController.js";
import { protect, isSeller } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/active", getActiveCoupons);
router.post("/validate", validateCoupon);

router.post("/", protect, isSeller, createCoupon);
router.get("/", protect, isSeller, getAllCoupons);
router.get("/:id", protect, isSeller, getCouponById);
router.put("/:id", protect, isSeller, updateCoupon);
router.delete("/:id", protect, isSeller, deleteCoupon);

export default router;
