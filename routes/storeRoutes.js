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

/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: Store management endpoints
 */

/**
 * @swagger
 * /api/stores/my/store:
 *   get:
 *     summary: Get seller's own store
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Store retrieved successfully
 *       404:
 *         description: Store not found
 *       403:
 *         description: Not a seller
 */
router.get("/my/store", protect, isSeller, getMyStore);

/**
 * @swagger
 * /api/stores:
 *   post:
 *     summary: Create a new store (Seller only)
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Pizza Paradise"
 *               address:
 *                 type: string
 *                 example: "123 Main St, New York"
 *               latitude:
 *                 type: number
 *                 example: 40.7128
 *               longitude:
 *                 type: number
 *                 example: -74.0060
 *               openHours:
 *                 type: string
 *                 example: "Mon-Sun: 9AM-10PM"
 *     responses:
 *       201:
 *         description: Store created successfully
 *       400:
 *         description: Seller already has a store
 *       403:
 *         description: Not a seller
 */
router.post("/", protect, isSeller, createStore);

/**
 * @swagger
 * /api/stores:
 *   put:
 *     summary: Update seller's store
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               openHours:
 *                 type: string
 *     responses:
 *       200:
 *         description: Store updated successfully
 *       404:
 *         description: Store not found
 *       403:
 *         description: Not a seller
 */
router.put("/", protect, isSeller, updateStore);

/**
 * @swagger
 * /api/stores:
 *   delete:
 *     summary: Delete seller's store
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Store deleted successfully
 *       404:
 *         description: Store not found
 *       403:
 *         description: Not a seller
 */
router.delete("/", protect, isSeller, deleteStore);

/**
 * @swagger
 * /api/stores:
 *   get:
 *     summary: Get all stores
 *     tags: [Stores]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         description: Latitude for location-based search
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         description: Longitude for location-based search
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *         description: Search radius in kilometers
 *     responses:
 *       200:
 *         description: List of stores
 */
router.get("/", getAllStores);

/**
 * @swagger
 * /api/stores/{id}:
 *   get:
 *     summary: Get store by ID
 *     tags: [Stores]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *     responses:
 *       200:
 *         description: Store details
 *       404:
 *         description: Store not found
 */
router.get("/:id", getStoreById);

export default router;
