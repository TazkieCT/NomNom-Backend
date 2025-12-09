import express from "express";
import {
  createOrUpdateAppRating,
  getMyAppRating,
  deleteMyAppRating,
  getApprovedAppRatings,
  getAllAppRatings,
  updateRatingApproval,
} from "../controllers/appRatingController.js";
import { protect, isSeller } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: App Ratings
 *   description: Application rating management
 */

/**
 * @swagger
 * /api/app-ratings/approved:
 *   get:
 *     summary: Get all approved app ratings (Public)
 *     tags: [App Ratings]
 *     security: []
 *     responses:
 *       200:
 *         description: List of approved ratings with statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ratings:
 *                   type: array
 *                 averageRating:
 *                   type: string
 *                 totalRatings:
 *                   type: number
 */
router.get("/approved", getApprovedAppRatings);

/**
 * @swagger
 * /api/app-ratings/my/rating:
 *   get:
 *     summary: Get user's own app rating
 *     tags: [App Ratings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's rating
 *       404:
 *         description: No rating found
 */
router.get("/my/rating", protect, getMyAppRating);

/**
 * @swagger
 * /api/app-ratings:
 *   post:
 *     summary: Create or update app rating (Any authenticated user)
 *     tags: [App Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Great app! Easy to use and saves me money."
 *     responses:
 *       201:
 *         description: Rating created successfully
 *       200:
 *         description: Rating updated successfully
 */
router.post("/", protect, createOrUpdateAppRating);

/**
 * @swagger
 * /api/app-ratings/my/rating:
 *   delete:
 *     summary: Delete user's own app rating
 *     tags: [App Ratings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rating deleted successfully
 *       404:
 *         description: No rating found
 */
router.delete("/my/rating", protect, deleteMyAppRating);

/**
 * @swagger
 * /api/app-ratings:
 *   get:
 *     summary: Get all app ratings (Seller/Admin only - for moderation)
 *     tags: [App Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: approved
 *         schema:
 *           type: boolean
 *         description: Filter by approval status
 *     responses:
 *       200:
 *         description: List of all ratings with statistics
 */
router.get("/", protect, isSeller, getAllAppRatings);

/**
 * @swagger
 * /api/app-ratings/{id}/approve:
 *   put:
 *     summary: Approve or reject app rating (Seller/Admin only)
 *     tags: [App Ratings]
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
 *             required:
 *               - isApproved
 *             properties:
 *               isApproved:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Rating approval status updated
 *       404:
 *         description: Rating not found
 */
router.put("/:id/approve", protect, isSeller, updateRatingApproval);

export default router;
