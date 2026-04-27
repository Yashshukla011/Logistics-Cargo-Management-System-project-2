import { Apierror } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/Apires.js";
import AsyncHandler from "../utils/Asynchandler.js";
import { ShipmentModel } from "../Models/Shipment.model.js";
import { sendEmail } from "../utils/mail.js";
import { sendNotification } from "../index.js";
import { WarehouseModel } from "../Models/Warehouse.model.js";


// ✅ CREATE SHIPMENT (same name)
const Shipment = AsyncHandler(async (req, res) => {
  const { receiverName, receiverAddress, weight, receiverEmail } = req.body;

  if (!receiverName || !receiverAddress || !weight || !receiverEmail) {
    throw new Apierror(400, "All fields are required");
  }

  // ❌ unused tha → remove kar diya
  // const warehouse = await WarehouseModel.findOne();

  const RATE_PER_KG = 50;
  const price = weight * RATE_PER_KG;

  const shipment = await ShipmentModel.create({
    sender: req.user._id,
    admin: req.user._id, // 🔥 IMPORTANT FIX (multi-admin support)
    receiverName,
    receiverAddress,
    receiverEmail,
    weight,
    price,
    trackerid: "TRK" + Date.now(),
    status: "created",
    paymentStatus: "PENDING",
    DocketNumber: "DCK" + Date.now(),
    currentWarehouse: null,
  });

  await sendEmail(
    shipment.receiverEmail,
    "Shipment Created",
    `Your shipment with tracker ID ${shipment.trackerid} has been created.`
  );

  sendNotification(req.user._id, {
    title: "Shipment Created 🚚",
    message: `Your shipment ${shipment.trackerid} has been created`,
  });

  return res.status(201).json(
    new ApiResponse(201, shipment, "Shipment created successfully")
  );
});


// ✅ GET USER SHIPMENTS (same name)
const getusershipment = AsyncHandler(async (req, res) => {
  const { q = "" } = req.query;

  const query = {
    sender: req.user._id,
  };

  if (q) {
    query.$or = [
      { receiverName: { $regex: q, $options: "i" } },
      { receiverAddress: { $regex: q, $options: "i" } },
      { trackerid: { $regex: q, $options: "i" } },
    ];
  }

  const shipments = await ShipmentModel.find(query)
    .populate("sender", "fullName email address")
    .populate("currentWarehouse", "name");

  const data = shipments.map((s) => ({
    _id: s._id,
    trackerid: s.trackerid,
    DocketNumber: s.DocketNumber,

    sender: s.sender
      ? {
          fullName: s.sender.fullName || "Unknown",
          address: s.sender.address || "",
          email: s.sender.email || "",
        }
      : null,

    receiverName: s.receiverName,
    receiverAddress: s.receiverAddress,
    weight: s.weight,
    price: s.price,
    status: s.status,
    createdAt: s.createdAt,

    currentWarehouse: s.currentWarehouse
      ? {
          _id: s.currentWarehouse._id,
          name: s.currentWarehouse.name,
        }
      : null,
  }));

  return res.status(200).json({
    success: true,
    message: "User shipments fetched successfully",
    data,
  });
});


// ✅ UPDATE STATUS (same name)
const updateshipmentstatus = AsyncHandler(async (req, res) => {
  const status = req.body.status?.toLowerCase();
  const { location } = req.body;

  if (!status) {
    throw new Apierror(400, "Status is required");
  }

  const shipment = await ShipmentModel.findById(req.params.id);

  if (!shipment) {
    throw new Apierror(404, "Shipment not found");
  }

  // 🔥 FIXED (case issue solved)
  if (shipment.paymentStatus !== "PAID") {
    throw new Apierror(400, "Payment not completed yet");
  }

  const flow = {
    created: ["packed"],
    packed: ["shipped"],
    shipped: ["in_transit"],
    in_transit: ["out_for_delivery"],
    out_for_delivery: ["delivered", "failed"],
    delivered: [],
    failed: [],
  };

  const currentStatus = shipment.status || "created";

  if (!flow[currentStatus].includes(status)) {
    throw new Apierror(
      400,
      `Invalid transition from ${currentStatus} to ${status}`
    );
  }

  shipment.status = status;

  if (!shipment.statusHistory) {
    shipment.statusHistory = [];
  }

  shipment.statusHistory.push({
    status,
    location: location || "Unknown",
  });

  await shipment.save();

  await sendEmail(
    shipment.receiverEmail,
    "Shipment Status Updated",
    `Your shipment ${shipment.trackerid} is now ${shipment.status}`
  );

  if (shipment.sender) {
    sendNotification(shipment.sender.toString(), {
      title: "Shipment Updated 🚚",
      message: `Your shipment ${shipment.trackerid} is now ${shipment.status}`,
    });
  }

  return res.status(200).json(
    new ApiResponse(200, shipment, "Status updated successfully")
  );
});


// ✅ EXPORT SAME
export { Shipment, getusershipment, updateshipmentstatus };