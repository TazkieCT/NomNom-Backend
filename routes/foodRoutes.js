import express from "express";
import {
  createFood,
  getAllFoods,
  getFoodById,
  getMyFoods,
  updateFood,
  deleteFood
} from "../controllers/foodController.js";
import { protect, isSeller } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my/foods", protect, isSeller, getMyFoods);
router.post("/", protect, isSeller, createFood);
router.put("/:id", protect, isSeller, updateFood);
router.delete("/:id", protect, isSeller, deleteFood);

router.get("/", getAllFoods);
router.get("/:id", getFoodById);

export default router;
