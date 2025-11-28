import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";
import { protect, isSeller } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

router.post("/", protect, isSeller, createCategory);
router.put("/:id", protect, isSeller, updateCategory);
router.delete("/:id", protect, isSeller, deleteCategory);

export default router;
