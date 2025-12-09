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
import appRatingRoutes from "./routes/appRatingRoutes.js";
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

app.use("/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/filters", dietFilterRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/app-ratings", appRatingRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
});
