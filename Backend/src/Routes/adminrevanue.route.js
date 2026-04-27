import express from "express";
import { verifyJWT, authorizeRoles } from "../middleware/Auth.middleware.js";
import { getRevenueStats, getRecentPayments } from "../controllers/admin.controller.js";

const router = express.Router();

// ✅ ADMIN ONLY
router.get("/stats", verifyJWT, authorizeRoles("admin"), getRevenueStats);
router.get("/recent", verifyJWT, authorizeRoles("admin"), getRecentPayments);

export default router;