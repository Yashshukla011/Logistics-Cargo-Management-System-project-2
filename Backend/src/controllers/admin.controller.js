import { PaymentModel } from "../Models/payment.model.js";

export const getRevenueStats = async (req, res) => {
  try {
    const adminId = req.user._id;

    const paidPayments = await PaymentModel.find({
      admin: adminId,
      paymentStatus: "PAID"
    });

    const pendingPayments = await PaymentModel.find({
      admin: adminId,
      paymentStatus: "UNPAID"
    });

    const totalRevenue = paidPayments.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    );

    res.json({
      totalRevenue,
      paidCount: paidPayments.length,
      pendingCount: pendingPayments.length
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getRecentPayments = async (req, res) => {
  try {
    const adminId = req.user._id;

    const payments = await PaymentModel.find({
      admin: adminId,
      paymentStatus: "PAID"
    })
      .populate("shipment")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: payments
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};