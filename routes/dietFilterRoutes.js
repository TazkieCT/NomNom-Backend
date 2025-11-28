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

/**
 * @swagger
 * tags:
 *   name: Diet Filters
 *   description: Dietary filter management (Vegan, Gluten-Free, etc.)
 */

/**
 * @swagger
 * /api/filters:
 *   get:
 *     summary: Get all diet filters
 *     tags: [Diet Filters]
 *     security: []
 *     responses:
 *       200:
 *         description: List of diet filters
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
 *                     example: "Vegan"
 */
router.get("/", getAllDietFilters);

/**
 * @swagger
 * /api/filters/{id}:
 *   get:
 *     summary: Get diet filter by ID
 *     tags: [Diet Filters]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Diet filter details
 *       404:
 *         description: Filter not found
 */
router.get("/:id", getDietFilterById);

/**
 * @swagger
 * /api/filters:
 *   post:
 *     summary: Create new diet filter (Seller only)
 *     tags: [Diet Filters]
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
 *                 example: "Vegan"
 *     responses:
 *       201:
 *         description: Filter created successfully
 *       400:
 *         description: Filter already exists
 *       403:
 *         description: Not a seller
 */
router.post("/", protect, isSeller, createDietFilter);

/**
 * @swagger
 * /api/filters/{id}:
 *   put:
 *     summary: Update diet filter (Seller only)
 *     tags: [Diet Filters]
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
 *         description: Filter updated successfully
 *       404:
 *         description: Filter not found
 *       403:
 *         description: Not a seller
 */
router.put("/:id", protect, isSeller, updateDietFilter);

/**
 * @swagger
 * /api/filters/{id}:
 *   delete:
 *     summary: Delete diet filter (Seller only)
 *     tags: [Diet Filters]
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
 *         description: Filter deleted successfully
 *       404:
 *         description: Filter not found
 *       403:
 *         description: Not a seller
 */
router.delete("/:id", protect, isSeller, deleteDietFilter);

export default router;
