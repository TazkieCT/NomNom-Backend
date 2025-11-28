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

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Food category management
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security: []
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 */
router.get("/", getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 */
router.get("/:id", getCategoryById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create new category (Seller only)
 *     tags: [Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Main Course"
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Category already exists
 *       403:
 *         description: Not a seller
 */
router.post("/", protect, isSeller, createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category (Seller only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *       403:
 *         description: Not a seller
 */
router.put("/:id", protect, isSeller, updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category (Seller only)
 *     tags: [Categories]
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
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       403:
 *         description: Not a seller
 */
router.delete("/:id", protect, isSeller, deleteCategory);

export default router;
