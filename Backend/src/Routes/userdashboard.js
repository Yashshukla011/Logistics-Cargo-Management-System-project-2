import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middleware/Auth.middleware.js";
import { getDashboardStats } from "../controllers/Userdashboard.js";

const router = Router();

router.get("/dashboard", verifyJWT, getUserDashboard);
export default router;