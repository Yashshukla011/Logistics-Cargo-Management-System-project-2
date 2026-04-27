import express from "express";
import { deleteAvatar } from "../Controllers/updateuserinfo.controller.js";
import { verifyJWT } from "../middleware/Auth.middleware.js";

const router = express.Router();

router.delete("/", verifyJWT, deleteAvatar);

export default router;