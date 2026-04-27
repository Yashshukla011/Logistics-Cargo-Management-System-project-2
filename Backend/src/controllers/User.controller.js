import User from "../Models/User.model.js";
import { ApiResponse } from "../utils/Apires.js";
import AsyncHandler from "../utils/Asynchandler.js";
import { Apierror } from "../utils/ApiError.js"; // 👈 small 'e'
import crypto from "crypto";
import { sendEmail } from "../utils/mail.js";


const GenerateAccessAndrefreshTocken = async (user_id) => {
  try {
    const user = await User.findById(user_id);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshTocken();

    user.refreshtoken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new Apierror(500, "Token generation failed");
  }
};

const Registeruser = AsyncHandler(async (req, res) => {

  const { fullName, email, username, password, role } = req.body;

  const avatar = req.file ? req.file.path : "";

  if ([fullName, email, username, password, role].some((field) => field?.trim() === "")) {
    throw new Apierror(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new Apierror(409, "User already exists");
  }
  // 🔥 ONLY ONE ADMIN ALLOWED
  if (role === "admin") {
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      throw new Apierror(400, "Only one admin allowed in system");
    }
  }

  const newUser = await User.create({
    username,
    email,
    fullName,
    password,
    role,
    avatar, 
  });

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshtoken"
  );

  return res.status(200).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  );
});

const loginUser = AsyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  console.log("LOGIN INPUT:", email, username);


  if (!(email || username)) {
    throw new Apierror(400, "Username or email is required");
  }

  let user;

  if (email) {
    user = await User.findOne({ email });
  } else {
    user = await User.findOne({ username });
  }

  console.log("FOUND USER:", user);


  if (!user) {
    throw new Apierror(404, "User not found");
  }


  const isMatch = await user.isPasswordmatch(password);

  if (!isMatch) {
    throw new Apierror(401, "Password incorrect");
  }


  const { accessToken, refreshToken } =
    await GenerateAccessAndrefreshTocken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );


  const options = {
    httpOnly: true,
    secure: false, // dev mode
    sameSite: "lax", // 🔥 IMPORTANT FIX
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      success: true,
      data: {
        user: {
          _id: loggedInUser._id,
          email: loggedInUser.email,
          username: loggedInUser.username,
          role: loggedInUser.role,
          fullName: loggedInUser.fullName,
        },
        accessToken,   // 🔥 token bhi bhej diya
        refreshToken,
      },
      message: "Login successful",
    });
});

const logout = AsyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshtoken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logout successful"));
});
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 min
  await user.save();

  const resetLink = `http://localhost:5173/reset-password/${token}`;

  await sendEmail(
    email,
    "Reset Password",
    `Click here to reset password: ${resetLink}`
  );

  res.json({ message: "Reset link sent to email" });
};


export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    console.log("TOKEN:", token);

    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    console.log("USER:", user);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);

    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};
export { Registeruser, loginUser, logout };