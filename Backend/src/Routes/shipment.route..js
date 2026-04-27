import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middleware/Auth.middleware.js";
import {
  Shipment,
  getusershipment,
  updateshipmentstatus
} from "../controllers/shipment.controller.js";
import {ShipmentModel} from "../Models/Shipment.model.js";
const router = Router();

router.post("/", verifyJWT, Shipment);
router.get("/my", verifyJWT, getusershipment);

router.patch(
  "/:id/status",
  verifyJWT,
  authorizeRoles("admin"),  // 👈 pehle check role
  updateshipmentstatus
);
router.get("/search", verifyJWT, async (req, res) => {
  try {
    const q = req.query.q?.trim() || "";
    const userId = req.user._id;
    const role = req.user.role;

    let filter = {};

    // 🔍 search condition
    if (q) {
      filter.$or = [
        { receiverName: { $regex: q, $options: "i" } },
        { trackerid: { $regex: q, $options: "i" } },
        { DocketNumber: { $regex: q, $options: "i" } }
      ];
    }

    // 🔥 FINAL LOGIC
    if (role !== "admin") {
      filter.sender = userId;   // user → only his
    }
    // admin → NO FILTER 🔥

    const data = await ShipmentModel.find(filter)
      .populate("sender")
      .sort({ createdAt: -1 });

    return res.json(data);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
});
// 👑 ADMIN - GET ALL SHIPMENTS
router.get(
  "/all",
  verifyJWT,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const data = await ShipmentModel.find()   // 🔥 REMOVE FILTER
        .populate("sender")
        .populate("currentWarehouse")
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        data,
      });

    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  }
);
export default router;