import User from "../Models/User.model.js";
import { ShipmentModel } from "../Models/Shipment.model.js";
import bcrypt from "bcrypt";

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");

    // 🔥 optimized query (sorted + clean)
    const shipments = await ShipmentModel.find({ sender: userId })
      .sort({ createdAt: -1 }); // newest first

    const total = shipments.length;

    const delivered = await ShipmentModel.countDocuments({
      sender: userId,
      status: "delivered",
    });

    const pending = await ShipmentModel.countDocuments({
      sender: userId,
      status: { $ne: "delivered" },
    });

    res.json({
      user,
      stats: {
        total,
        delivered,
        pending,
      },
      recentShipments: shipments.slice(0, 5), // latest 5
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, email } = req.body;

    let updateData = { fullName, email };

    // ✅ agar image upload hui hai
    if (req.file) {
      updateData.avatar = req.file.path.replace(/\\/g, "/");
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password wrong" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAvatar = async (req, res) => {
  try {
    const userId = req.user._id;

    // avatar null kar do
    await User.findByIdAndUpdate(
      userId,
      { avatar: "" },
      { new: true } // (warning fix niche diya hai 👇)
    );

    res.status(200).json({
      success: true,
      message: "Avatar removed",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error deleting avatar",
    });
  }
};