import express from "express";
import {
  createDietFilter,
  getAllDietFilters,
  getDietFilterById,
  updateDietFilter,
  deleteDietFilter
} from "../controllers/dietFilterController.js";
import { protect, isSeller } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllDietFilters);
router.get("/:id", getDietFilterById);

router.post("/", protect, isSeller, createDietFilter);
router.put("/:id", protect, isSeller, updateDietFilter);
router.delete("/:id", protect, isSeller, deleteDietFilter);

export default router;
