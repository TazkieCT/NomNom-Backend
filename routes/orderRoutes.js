import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";
import { protect, isSeller, isCustomer } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create new order (Customer only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - storeId
 *               - items
 *             properties:
 *               storeId:
 *                 type: string
 *                 example: "64a1b2c3d4e5f6g7h8i9j0k1"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     foodId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                 example:
 *                   - foodId: "64a1b2c3d4e5f6g7h8i9j0k1"
 *                     quantity: 2
 *               couponCode:
 *                 type: string
 *                 example: "SAVE20"
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid order data
 *       403:
 *         description: Not a customer
 */
router.post("/", protect, isCustomer, createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (Customer sees own orders, Seller sees store orders)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, paid, cancelled, completed]
 *         description: Filter by order status
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get("/", protect, getAllOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
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
 *         description: Order details
 *       404:
 *         description: Order not found
 *       403:
 *         description: Access denied
 */
router.get("/:id", protect, getOrderById);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Cancel order (Customer only, pending orders only)
 *     tags: [Orders]
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
 *         description: Order cancelled successfully
 *       400:
 *         description: Cannot cancel non-pending orders
 *       404:
 *         description: Order not found
 *       403:
 *         description: Not your order
 */
router.put("/:id/cancel", protect, isCustomer, cancelOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (Seller only)
 *     tags: [Orders]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, paid, cancelled, completed]
 *                 example: "completed"
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Order not found
 *       403:
 *         description: Not authorized to update this order
 */
router.put("/:id/status", protect, isSeller, updateOrderStatus);

export default router;
