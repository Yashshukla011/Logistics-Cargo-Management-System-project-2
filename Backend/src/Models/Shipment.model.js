import mongoose from "mongoose";

const ShipmentSchema = new mongoose.Schema(
  {
    trackerid: {
      type: String,
      required: true,
      unique: true
    },
admin: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},
    DocketNumber: {
      type: String,
      required: true,
      unique: true
    },

sender: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},

    receiverName: {
      type: String,
      required: true
    },

    receiverAddress: {
      type: String,
      required: true
    },

    weight: {
      type: Number,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: [
        "created",
        "packed",
        "shipped",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "failed"
      ],
      default: "created"
    },

    receiverEmail: {
      type: String,
      required: true
    },

    statusHistory: [
      {
        status: String,
        updatedAt: { type: Date, default: Date.now },
        location: String
      }
    ],

    currentWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
     default: null
    },

   paymentStatus: {
  type: String,
  enum: ["PENDING", "PAID", "FAILED"]
},

    orderId: String,
    paymentId: String
  },
  { timestamps: true }
);

export const ShipmentModel =
  mongoose.models.Shipment || mongoose.model("Shipment", ShipmentSchema);