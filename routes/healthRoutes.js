import express from "express";
import { health } from "../controllers/healthController.js";

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health status
 *     tags: [Health]
 *     security: []
 *     description: Returns the health status of the API and database connection
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", health);

export default router;
