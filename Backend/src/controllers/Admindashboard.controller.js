import AsyncHandler from "../utils/Asynchandler.js";
import { PaymentModel } from "../Models/payment.model.js";
import { ShipmentModel } from "../Models/Shipment.model.js";

const getDashboardStats = AsyncHandler(async (req, res) => {

  const adminId = req.user._id; // 🔥 MOST IMPORTANT

  const [totalShipments, delivered, revenueData, pending] = await Promise.all([

    // ✅ ADMIN FILTER
    ShipmentModel.countDocuments({ admin: adminId }),

    ShipmentModel.countDocuments({
      admin: adminId,
      status: "delivered"
    }),

    // ✅ REVENUE FILTER
    PaymentModel.aggregate([
      {
        $match: {
          status: "success",
          admin: adminId   // 🔥 FIX
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }
        }
      }
    ]),

    // ✅ PENDING FILTER
    ShipmentModel.countDocuments({
      admin: adminId,
      paymentStatus: { $ne: "PAID" }
    })

  ]);

  const revenue = revenueData[0]?.totalRevenue || 0;

  res.json({
    totalShipments,
    delivered,
    pending,
    revenue   // ❌ /100 मत करो
  });
});

export { getDashboardStats };