import mongoose,{Schema} from "mongoose";
const trackingSchema = new mongoose.Schema({
  shipment: {
    type: Schema.Types.ObjectId,
    ref: "ShipmentModel"
  },
  status: {
    type: String,
    enum: ["Pending", "Picked", "In Transit", "Delivered"]
  },
  location: {
    type: String
  }
}, { timestamps: true });

export const Tracking = mongoose.model("Tracking", trackingSchema);