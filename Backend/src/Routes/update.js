import express from "express";
import { getProfile, updateProfile, changePassword } from "../controllers/updateuserinfo.controller.js";
import {verifyJWT} from "../middleware/Auth.middleware.js";
import { upload } from "../middleware/upload.js";
const router = express.Router();

router.get("/me", verifyJWT, getProfile);
router.put("/update", verifyJWT, upload.single("avatar"), updateProfile);
router.put("/change-password", verifyJWT, changePassword);

export default router;