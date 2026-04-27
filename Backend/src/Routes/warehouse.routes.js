import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middleware/Auth.middleware.js";
import {
  createwarehouse,
  AssignshipmentTowarehouse,
  moveShipment
} from "../controllers/Warehouse.controller.js";
import { WarehouseModel } from "../Models/Warehouse.model.js";

const router = Router();

// ❌ REMOVE THIS (confusing)
// router.get("/my", verifyJWT, getMyShipments);

// ✅ CREATE WAREHOUSE (ADMIN)
router.post("/create", verifyJWT, authorizeRoles("admin"), createwarehouse);

// ✅ GET ALL WAREHOUSES
router.get("/", verifyJWT, authorizeRoles("admin"), async (req, res) => {
  const warehouses = await WarehouseModel.find();
  res.json({ warehouses });
});

// ✅ ASSIGN
router.post(
  "/assign",
  verifyJWT,
  authorizeRoles("admin"),
  AssignshipmentTowarehouse
);

// ✅ MOVE
router.post(
  "/move",
  verifyJWT,
  authorizeRoles("admin"),
  moveShipment
);

export default router;