import { Apierror } from "../utils/ApiError.js";
import asynchandler from "../utils/Asynchandler.js";
import jwt from "jsonwebtoken";
import User from "../Models/User.model.js";

export const verifyJWT = asynchandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  // console.log("Token received:", token);

  if (!token) {
    throw new Apierror(401, "Unauthorized request");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decoded.id).select("-password -refreshtoken");

  if (!user) {
    throw new Apierror(401, "Invalid token");
  }

  req.user = user;
  
  next();
});

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next();
  };
};
