import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middleware/Auth.middleware.js";

import {
  createSupport,
  getmyticket,
  updateSupport,
  getAllTickets,
  getTicketById
} from "../controllers/support.contriller.js";
import { get } from "mongoose";

const router = Router();

/* ---------------- USER ---------------- */
router.post("/create", verifyJWT, createSupport);

router.get("/my", verifyJWT, getmyticket);

/* ---------------- UPDATE ---------------- */
router.put(
  "/:id",
  verifyJWT,
  authorizeRoles("admin", "user", "subuser"),
  updateSupport
);

/* ---------------- ADMIN ---------------- */
router.get(
  "/all",
  verifyJWT,
  authorizeRoles("admin"),
  getAllTickets   // ✅ 🔥 यही use करना है
);
router.get("/:id", getTicketById);
export default router;