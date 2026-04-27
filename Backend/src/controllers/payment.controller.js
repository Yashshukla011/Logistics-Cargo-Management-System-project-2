import Razorpay from "razorpay";
import crypto from "crypto";
import { ShipmentModel } from "../Models/Shipment.model.js";
import { PaymentModel } from "../Models/payment.model.js";

// 🔑 Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { shipmentId } = req.body;

    const shipment = await ShipmentModel.findById(shipmentId);

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    const options = {
      amount: shipment.price * 100, // paise
      currency: "INR",
      receipt: shipment._id.toString(),
    };

    const order = await razorpay.orders.create(options);

    // 🔥 SAVE ORDER ID
    shipment.razorpayOrderId = order.id;
    await shipment.save();

    return res.json({
      success: true,
      order,
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ VERIFY PAYMENT
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // 🔐 VERIFY SIGNATURE
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment" });
    }

    // 🔍 FIND SHIPMENT
    const shipment = await ShipmentModel.findOne({
      razorpayOrderId: razorpay_order_id,
    });
console.log("PAYMENT VERIFY HIT");
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    // ✅ UPDATE SHIPMENT
    shipment.paymentStatus = "PAID"; // 🔥 IMPORTANT (UPPERCASE)
    shipment.paymentId = razorpay_payment_id;

    await shipment.save();

    // ✅ SAVE PAYMENT WITH ADMIN LINK
    await PaymentModel.create({
      shipment: shipment._id,
      userId: req.user._id, 
      
      amount: shipment.price,
      status: "success", // 🔥 IMPORTANT (lowercase for aggregation)
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
  paymentStatus: "PAID",
      // 🔥 VERY IMPORTANT FOR ADMIN REVENUE
      admin: shipment.admin,
    });

    return res.json({
      success: true,
      message: "Payment verified successfully",
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
 const getPayments = async (req, res) => {
   try {
    const user = req.user;

    let payments;

    if (user.role === "admin") {
      payments = await PaymentModel.find()
        .populate("shipment");   // ✅ correct
    } else {
      payments = await PaymentModel.find({ userId: user._id })
        .populate("shipment");   // ✅ correct
    }
    console.log("USER ID:", req.user._id);
    console.log("PAYMENTS:", payments);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export { createOrder, verifyPayment,getPayments};