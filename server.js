import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
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

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
});
