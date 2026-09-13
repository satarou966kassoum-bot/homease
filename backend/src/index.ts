import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import listingRoutes from "./routes/listingRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";
import reservationRoutes from "./routes/reservationRoutes";
import messageRoutes from "./routes/messageRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import reportRoutes from "./routes/reportRoutes";
import adminRoutes from "./routes/adminRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import bannerRoutes from "./routes/bannerRoutes";
import collectionRoutes from "./routes/collectionRoutes";
import reviewRoutes from "./routes/reviewRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

// Sécurité de base
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Limite le nombre de requêtes pour éviter les abus (brute force, spam)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "HomeEase API opérationnelle." });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/conversations", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 HomeEase API démarrée sur le port ${PORT}`);
  });
}

start();
