import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import dietFilterRoutes from "./routes/dietFilterRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import { swaggerSpec } from "./config/swagger.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "NomNom API Docs",
}));

// Public health checks (no auth required)
app.use("/health", healthRoutes);

// Auth routes
app.use("/api/auth", authRoutes);

// Store routes
app.use("/api/stores", storeRoutes);

// Category routes
app.use("/api/categories", categoryRoutes);

// Diet filter routes
app.use("/api/filters", dietFilterRoutes);

// Food routes
app.use("/api/foods", foodRoutes);

// Coupon routes
app.use("/api/coupons", couponRoutes);

// Order routes
app.use("/api/orders", orderRoutes);

// Review routes
app.use("/api/reviews", reviewRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
});
