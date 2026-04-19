import { useEffect, useState } from "react";
import API from "../api/axios";

const AssignShipment = () => {
  const [shipments, setShipments] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [shipmentId, setShipmentId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");

  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 Fetch shipments + warehouses
  const fetchData = async () => {
    try {
      // ✅ CHANGE ONLY THIS LINE
      const shipRes = await API.get(
        user?.role === "admin" ? "/shipments/all" : "/shipments/my"
      );

      const wareRes = await API.get("/warehouse/");

      console.log("ALL SHIPMENTS:", shipRes.data);

      // ✅ SAFE SET
      setShipments(
        Array.isArray(shipRes.data?.data)
          ? shipRes.data.data
          : shipRes.data || []
      );

      setWarehouses(wareRes.data.warehouses || []);

    } catch (err) {
      console.log(err);
      alert("Error fetching data");
    }
  };

  useEffect(() => {
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

      setShipmentId("");
      setWarehouseId("");

      // ✅ REFRESH DATA AFTER ASSIGN
      fetchData();

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
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select Shipment</option>

            {Array.isArray(shipments) &&
              shipments.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.trackerid} ({s.receiverName})
                </option>
              ))}
          </select>

          {/* Warehouse Dropdown */}
          <select
            value={warehouseId}
            onChange={(e) => setWarehouseId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
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
            className={`w-full py-2 rounded-lg text-white ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
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