import dotenv from "dotenv";
dotenv.config(); // Load environment variables

import express from "express";
import cors from "cors";
import morgan from "morgan";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/export", exportRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ success: true, message: "CareerLedger API is running..." });
});

// Error middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
