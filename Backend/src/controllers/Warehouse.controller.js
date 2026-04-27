import AsyncHandler from "../utils/Asynchandler.js";
import { WarehouseModel } from "../Models/Warehouse.model.js";
import { ShipmentModel } from "../Models/Shipment.model.js";
import { Apierror } from "../utils/ApiError.js";

const createwarehouse = AsyncHandler(async (req, res) => {
  const { name, location, capacity } = req.body;

  if (!name || !location || !capacity) {
    throw new Apierror(400, "All field required"); // ✅ 404 → 400
  }

  const warehouse = await WarehouseModel.create({
    name,
    location,
    capacity,
  });

  return res.status(201).json({ success: true, warehouse });
});
const getMyShipments = AsyncHandler(async (req, res) => {

  const shipments = await ShipmentModel.find({
    sender: req.user._id
  })
  .populate("currentWarehouse", "name");

  res.status(200).json({
    success: true,
    message: "User shipments fetched successfully",
    data: shipments
  });
});

const AssignshipmentTowarehouse = AsyncHandler(async (req, res) => {
  const { shipmentId, warehouseId } = req.body;

  const warehouse = await WarehouseModel.findById(warehouseId);
  if (!warehouse) throw new Apierror(404, "Warehouse not found");

  const shipment = await ShipmentModel.findById(shipmentId);
  if (!shipment) throw new Apierror(404, "Shipment not found");

  // ✅ NEW: capacity check
  if (warehouse.currentItems >= warehouse.capacity) {
    throw new Apierror(400, "Warehouse full");
  }

  // ✅ NEW: remove from old warehouse if exists
  if (shipment.currentWarehouse) {
    const oldWarehouse = await WarehouseModel.findById(
      shipment.currentWarehouse
    );

    if (oldWarehouse) {
      oldWarehouse.currentItems = Math.max(
        0,
        oldWarehouse.currentItems - 1
      );
      await oldWarehouse.save();
    }
  }

  // SAME LOGIC
  shipment.currentWarehouse = warehouseId;

  shipment.statusHistory.push({
    status: shipment.status,
    location: warehouse.name,
    updatedBy: req.user._id,
  });

  await shipment.save();

  warehouse.currentItems += 1;
  await warehouse.save();

  return res.status(200).json({ success: true, shipment, warehouse });
});

// ✅ MOVE (FIXED)
const moveShipment = AsyncHandler(async (req, res) => {
  const { shipmentId, toWarehouseId } = req.body;

  const shipment = await ShipmentModel.findById(shipmentId);
  if (!shipment) throw new Apierror(404, "Shipment not found");

  const fromWarehouse = await WarehouseModel.findById(
    shipment.currentWarehouse
  );
  const toWarehouse = await WarehouseModel.findById(toWarehouseId);

  if (!toWarehouse) {
    throw new Apierror(404, "Destination warehouse not found");
  }

  // ✅ NEW: same warehouse check
  if (shipment.currentWarehouse?.toString() === toWarehouseId) {
    throw new Apierror(400, "Already in same warehouse");
  }

  // ✅ NEW: capacity check
  if (toWarehouse.currentItems >= toWarehouse.capacity) {
    throw new Apierror(400, "Warehouse full");
  }

  // SAME LOGIC
  shipment.currentWarehouse = toWarehouseId;

  shipment.statusHistory.push({
    status: shipment.status,
    location: toWarehouse.name,
    updatedBy: req.user._id,
  });

  await shipment.save();

  if (fromWarehouse) {
    fromWarehouse.currentItems = Math.max(
      0,
      fromWarehouse.currentItems - 1
    );
    await fromWarehouse.save();
  }

  toWarehouse.currentItems += 1;
  await toWarehouse.save();

  res.status(200).json({
    success: true,
    shipment,
    fromWarehouse,
    toWarehouse,
  });
});

export {
  createwarehouse,
  AssignshipmentTowarehouse,
  moveShipment,
  getMyShipments
};