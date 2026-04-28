import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./Routes/User.Route.js";
import shipmentRoutes from "./Routes/shipment.route..js";
import trackingRoutes from "./Routes/tracking.routes.js";
import adminRoutes from "./Routes/admin.route.js";
import warehouseRoutes from "./Routes/warehouse.routes.js";
import paymentRoutes from "./Routes/payment.route.js";
import userRoute from "./Routes/update.js";
import support from "./Routes/support.js"
import { upload } from "./middleware/upload.js";
import revenueRoutes from "./Routes/adminrevanue.route.js";
import Deleteimg from "./Routes/avatar.route.js"
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://logistics-cargo-management-system-p.vercel.app"
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/shipments", shipmentRoutes);
app.use("/api/v1/tracking", trackingRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/warehouse", warehouseRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/user", userRoute); 
app.use("/api/v1/support", support);
app.use("/uploads", express.static("uploads"));// For profile routes
// Error Handler
app.use("/api/v1/revenue", revenueRoutes);
app.use("/api/v1/avatar", Deleteimg);
app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

export { app };