import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middleware/Auth.middleware.js";
import { getDashboardStats } from "../controllers/Admindashboard.controller.js";

const router = Router();

router.get(
  "/dashboard",
  verifyJWT,
  authorizeRoles("admin"),
  getDashboardStats
);

export default router;