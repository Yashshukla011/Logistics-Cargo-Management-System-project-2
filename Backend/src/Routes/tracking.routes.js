import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middleware/Auth.middleware.js";
import {
  shipmenttracking,
  currentstatus
} from "../controllers/tracking.controller.js";

const router = Router();

router.get("/:trackingid", shipmenttracking);

router.get(
  "/current/:trackingid",
  verifyJWT,
  authorizeRoles("admin", "user"),
  currentstatus
);

export default router;