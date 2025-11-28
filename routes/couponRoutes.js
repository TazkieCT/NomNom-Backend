import express from "express";
import {
  createCoupon,
  getAllCoupons,
  getActiveCoupons,
  validateCoupon,
  getCouponById,
  updateCoupon,
  deleteCoupon
} from "../controllers/couponController.js";
import { protect, isSeller } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: Discount coupon management
 */

/**
 * @swagger
 * /api/coupons/active:
 *   get:
 *     summary: Get all active coupons (not expired, still have usage)
 *     tags: [Coupons]
 *     security: []
 *     responses:
 *       200:
 *         description: List of active coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/active", getActiveCoupons);

/**
 * @swagger
 * /api/coupons/validate:
 *   post:
 *     summary: Validate a coupon code
 *     tags: [Coupons]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - orderTotal
 *             properties:
 *               code:
 *                 type: string
 *                 example: "SAVE20"
 *               orderTotal:
 *                 type: number
 *                 example: 100
 *     responses:
 *       200:
 *         description: Coupon is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 discount:
 *                   type: number
 *                 finalPrice:
 *                   type: number
 *       404:
 *         description: Coupon not found
 *       400:
 *         description: Coupon invalid or expired
 */
router.post("/validate", validateCoupon);

/**
 * @swagger
 * /api/coupons:
 *   post:
 *     summary: Create new coupon (Seller only)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discountPercentage
 *               - expiresAt
 *               - usageLimit
 *             properties:
 *               code:
 *                 type: string
 *                 example: "SAVE20"
 *               discountPercentage:
 *                 type: number
 *                 example: 20
 *               maxDiscountAmount:
 *                 type: number
 *                 example: 10
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31T23:59:59.000Z"
 *               usageLimit:
 *                 type: number
 *                 example: 100
 *               minimumOrder:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *       400:
 *         description: Coupon code already exists
 *       403:
 *         description: Not a seller
 */
router.post("/", protect, isSeller, createCoupon);

/**
 * @swagger
 * /api/coupons:
 *   get:
 *     summary: Get all coupons (Seller only)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all coupons
 *       403:
 *         description: Not a seller
 */
router.get("/", protect, isSeller, getAllCoupons);

/**
 * @swagger
 * /api/coupons/{id}:
 *   get:
 *     summary: Get coupon by ID (Seller only)
 *     tags: [Coupons]
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
 *         description: Coupon details
 *       404:
 *         description: Coupon not found
 *       403:
 *         description: Not a seller
 */
router.get("/:id", protect, isSeller, getCouponById);

/**
 * @swagger
 * /api/coupons/{id}:
 *   put:
 *     summary: Update coupon (Seller only)
 *     tags: [Coupons]
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
 *               code:
 *                 type: string
 *               discountPercentage:
 *                 type: number
 *               maxDiscountAmount:
 *                 type: number
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *               usageLimit:
 *                 type: number
 *               minimumOrder:
 *                 type: number
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *       404:
 *         description: Coupon not found
 *       403:
 *         description: Not a seller
 */
router.put("/:id", protect, isSeller, updateCoupon);

/**
 * @swagger
 * /api/coupons/{id}:
 *   delete:
 *     summary: Delete coupon (Seller only)
 *     tags: [Coupons]
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
 *         description: Coupon deleted successfully
 *       404:
 *         description: Coupon not found
 *       403:
 *         description: Not a seller
 */
router.delete("/:id", protect, isSeller, deleteCoupon);

export default router;
