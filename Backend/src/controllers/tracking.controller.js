import {Apierror} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/Apires.js"
import AsyncHandler from "../utils/Asynchandler.js"
import { ShipmentModel } from "../Models/Shipment.model.js"
import {Tracking} from "../Models/tracking.model.js"
const shipmenttracking=AsyncHandler(async(req,res)=>{
    try {
 const { trackingid } = req.params;  

    const shipment = await ShipmentModel.findOne({ trackerid: trackingid });

    if (!shipment) {
      return res.status(404).json({
        message: "Error tracking shipment",
        error: "shipment not found"
      });
    }

    return res.status(200).json({
      success: true,
      shipment
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error tracking shipment",
      error: error.message
    });
  }
});
const currentstatus=AsyncHandler(async(req,res)=>{
    try {
         const {trackingid}=req.params
    const Shipment=await ShipmentModel.findOne({trackerid: trackingid })
    if(!Shipment){
         return res.status(404).json({ message: "Shipment not found" });
    }
  if (
    Shipment.sender.toString() !== req.user._id.toString() &&
    Shipment.receiver.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }
return res.status(200).json({
        trackingId: Shipment.trackerid,
      currentStatus: Shipment.status,
      history: Shipment.statusHistory
})
    } catch (error) {
          return res.status(500).json({
      message: "Error tracking shipment",
      error: error.message
    });
    }
   
})
export {shipmenttracking,currentstatus}