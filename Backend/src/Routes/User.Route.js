import { Router } from "express";
import {
  Registeruser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword
} from "../controllers/User.controller.js";

import {
  getProfile,
  updateProfile,
  changePassword,

} from "../controllers/updateuserinfo.controller.js"; // 👈 adjust path

import { verifyJWT } from "../middleware/Auth.middleware.js";
import { upload } from "../middleware/upload.js";

const router = Router();

// AUTH
router.post("/register", upload.single("avatar"), Registeruser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logout);

// ✅ ADD THESE (IMPORTANT)
router.get("/me", verifyJWT, getProfile);

router.put(
  "/update",
  verifyJWT,
  upload.single("avatar"), // 🔥 THIS WAS MISSING
  updateProfile
);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/change-password", verifyJWT, changePassword);

export default router;