import { useEffect, useState } from "react";
import API from "../api/axios";

const AssignShipment = () => {
  const [shipments, setShipments] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [shipmentId, setShipmentId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");

  const [loading, setLoading] = useState(false);

  // 🔥 Fetch shipments + warehouses
  useEffect(() => {
  const fetchData = async () => {
    try {
      const shipRes = await API.get("/shipments/my");
      const wareRes = await API.get("/warehouse/");

      console.log(shipRes.data);
      console.log(wareRes.data);

      setShipments(shipRes.data.message || []);
      setWarehouses(wareRes.data.warehouses || []);

    } catch (err) {
      console.log(err);
      alert("Error fetching data");
    }
  };

  fetchData();
}, []);

  // 🔥 Assign shipment
  const handleAssign = async (e) => {
    e.preventDefault();

    if (!shipmentId || !warehouseId) {
      alert("Please select both fields");
      return;
    }

    try {
      setLoading(true);

      await API.post("/warehouse/assign", {
        shipmentId,
        warehouseId,
      });

      alert("Shipment Assigned Successfully ✅");

      // reset selection
      setShipmentId("");
      setWarehouseId("");

    } catch (err) {
      alert(err.response?.data?.message || "Error assigning shipment ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-6">

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Assign Shipment
        </h2>

        <form onSubmit={handleAssign} className="space-y-4">

          {/* Shipment Dropdown */}
          <select
            value={shipmentId}
            onChange={(e) => setShipmentId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Shipment</option>
            {shipments.map((s) => (
              <option key={s._id} value={s._id}>
                {s.trackerid} ({s.receiverName})
              </option>
            ))}
          </select>

          {/* Warehouse Dropdown */}
          <select
            value={warehouseId}
            onChange={(e) => setWarehouseId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Warehouse</option>
            {warehouses.map((w) => (
              <option key={w._id} value={w._id}>
                {w.name} ({w.location})
              </option>
            ))}
          </select>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-medium transition ${
              loading
                ? "bg-gray-400"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Assigning..." : "Assign Shipment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignShipment;