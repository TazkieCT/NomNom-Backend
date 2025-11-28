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

/**
 * @swagger
 * tags:
 *   name: Foods
 *   description: Food item management
 */

/**
 * @swagger
 * /api/foods/my/foods:
 *   get:
 *     summary: Get seller's own food items
 *     tags: [Foods]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of seller's foods
 *       404:
 *         description: Seller has no store
 *       403:
 *         description: Not a seller
 */
router.get("/my/foods", protect, isSeller, getMyFoods);

/**
 * @swagger
 * /api/foods:
 *   post:
 *     summary: Create new food item (Seller only)
 *     tags: [Foods]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryId
 *               - name
 *               - price
 *             properties:
 *               categoryId:
 *                 type: string
 *                 example: "64a1b2c3d4e5f6g7h8i9j0k1"
 *               name:
 *                 type: string
 *                 example: "Margherita Pizza"
 *               description:
 *                 type: string
 *                 example: "Classic tomato sauce, mozzarella, and basil"
 *               price:
 *                 type: number
 *                 example: 12.99
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/pizza1.jpg"]
 *               filters:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64a1b2c3d4e5f6g7h8i9j0k1"]
 *     responses:
 *       201:
 *         description: Food created successfully
 *       403:
 *         description: Seller must have a store first
 */
router.post("/", protect, isSeller, createFood);

/**
 * @swagger
 * /api/foods/{id}:
 *   put:
 *     summary: Update food item (Seller only)
 *     tags: [Foods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               isAvailable:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               filters:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Food updated successfully
 *       404:
 *         description: Food not found
 *       403:
 *         description: Not authorized to update this food
 */
router.put("/:id", protect, isSeller, updateFood);

/**
 * @swagger
 * /api/foods/{id}:
 *   delete:
 *     summary: Delete food item (Seller only)
 *     tags: [Foods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Food deleted successfully
 *       404:
 *         description: Food not found
 *       403:
 *         description: Not authorized to delete this food
 */
router.delete("/:id", protect, isSeller, deleteFood);

/**
 * @swagger
 * /api/foods:
 *   get:
 *     summary: Get all foods with optional filters
 *     tags: [Foods]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: storeId
 *         schema:
 *           type: string
 *         description: Filter by store ID
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *         description: Filter by availability
 *       - in: query
 *         name: filters
 *         schema:
 *           type: string
 *         description: Comma-separated diet filter IDs
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name and description
 *     responses:
 *       200:
 *         description: List of foods
 */
router.get("/", getAllFoods);

/**
 * @swagger
 * /api/foods/{id}:
 *   get:
 *     summary: Get food by ID
 *     tags: [Foods]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Food details
 *       404:
 *         description: Food not found
 */
router.get("/:id", getFoodById);

export default router;
