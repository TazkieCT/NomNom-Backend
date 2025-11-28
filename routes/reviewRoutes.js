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

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Food review management
 */

/**
 * @swagger
 * /api/reviews/my/reviews:
 *   get:
 *     summary: Get customer's own reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customer's reviews
 *       403:
 *         description: Not a customer
 */
router.get("/my/reviews", protect, isCustomer, getMyReviews);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create new review (Customer only, must have completed order)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - foodId
 *               - rating
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "64a1b2c3d4e5f6g7h8i9j0k1"
 *               foodId:
 *                 type: string
 *                 example: "64a1b2c3d4e5f6g7h8i9j0k1"
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Amazing food! Will order again."
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Invalid data or already reviewed
 *       403:
 *         description: Not a customer or not your order
 */
router.post("/", protect, isCustomer, createReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update review (Customer only, own reviews)
 *     tags: [Reviews]
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
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Review not found
 *       403:
 *         description: Not your review
 */
router.put("/:id", protect, isCustomer, updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete review (Customer only, own reviews)
 *     tags: [Reviews]
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
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 *       403:
 *         description: Not your review
 */
router.delete("/:id", protect, isCustomer, deleteReview);

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews with optional filters
 *     tags: [Reviews]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: foodId
 *         schema:
 *           type: string
 *         description: Filter by food ID
 *       - in: query
 *         name: storeId
 *         schema:
 *           type: string
 *         description: Filter by store ID
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *         description: Filter by customer ID
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Minimum rating (1-5)
 *       - in: query
 *         name: maxRating
 *         schema:
 *           type: number
 *         description: Maximum rating (1-5)
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get("/", getAllReviews);

/**
 * @swagger
 * /api/reviews/food/{foodId}:
 *   get:
 *     summary: Get all reviews for a specific food with average rating
 *     tags: [Reviews]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: foodId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Food reviews with statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                 averageRating:
 *                   type: string
 *                 totalReviews:
 *                   type: number
 */
router.get("/food/:foodId", getFoodReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get review by ID
 *     tags: [Reviews]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review details
 *       404:
 *         description: Review not found
 */
router.get("/:id", getReviewById);

export default router;
