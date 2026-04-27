import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema({
  shipment: {
    type: Schema.Types.ObjectId,
    ref: "Shipment"
  },

  user: {                         // 🔥 ADD
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  admin: {                        // 🔥 ADD
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  amount: Number,

 paymentStatus: {
  type: String,
  enum: ["PAID", "UNPAID", "FAILED"],
  default: "UNPAID"
},

  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String

}, { timestamps: true });
export const PaymentModel =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);