import express from "express";
import {
  createReview,
  getAllReviews,
  getFoodReviews,
  getReviewById,
  getMyReviews,
  updateReview,
  deleteReview
} from "../controllers/reviewController.js";
import { protect, isCustomer } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my/reviews", protect, isCustomer, getMyReviews);
router.post("/", protect, isCustomer, createReview);
router.put("/:id", protect, isCustomer, updateReview);
router.delete("/:id", protect, isCustomer, deleteReview);

router.get("/", getAllReviews);
router.get("/food/:foodId", getFoodReviews);
router.get("/:id", getReviewById);

export default router;
