import express from "express";
import {
  createStore,
  getAllStores,
  getStoreById,
  getMyStore,
  updateStore,
  deleteStore
} from "../controllers/storeController.js";
import { protect, isSeller } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my/store", protect, isSeller, getMyStore);
router.post("/", protect, isSeller, createStore);
router.put("/", protect, isSeller, updateStore);
router.delete("/", protect, isSeller, deleteStore);

router.get("/", getAllStores);
router.get("/:id", getStoreById);

export default router;
