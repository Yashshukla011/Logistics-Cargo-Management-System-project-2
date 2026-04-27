import express from "express";
import { createOrder, verifyPayment,getPayments } from "../controllers/payment.controller.js";
import { verifyJWT } from "../middleware/Auth.middleware.js";

const router = express.Router();

// ✅ ADD verifyJWT
router.post("/create-order", verifyJWT, createOrder);

router.post("/verify-payment", verifyJWT, verifyPayment);
router.get("/my", verifyJWT, getPayments);

export default router;