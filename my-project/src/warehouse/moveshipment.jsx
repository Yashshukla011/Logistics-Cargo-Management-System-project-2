import { useEffect, useState } from "react";
import API from "../api/axios";

const MoveShipment = () => {
  const [shipments, setShipments] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [shipmentId, setShipmentId] = useState("");
  const [toWarehouseId, setToWarehouseId] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchData = async () => {
    try {
      // ✅ FIXED HERE
      const shipRes = await API.get(
        user?.role === "admin"
          ? "/shipments/all"   // 🔥 FIX
          : "/shipments/my"
      );

      const wareRes = await API.get("/warehouse/");

      setShipments(
        Array.isArray(shipRes.data?.data)
          ? shipRes.data.data
          : shipRes.data || []
      );

      setWarehouses(wareRes.data.warehouses || []);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMove = async (e) => {
    e.preventDefault();

    if (!shipmentId || !toWarehouseId) {
      alert("Select both fields");
      return;
    }

    try {
      await API.post("/warehouse/move", {
        shipmentId,
        toWarehouseId,
      });

      alert("Shipment moved successfully 🚚");

      setShipmentId("");
      setToWarehouseId("");

      fetchData();

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
   <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
  <form
    onSubmit={handleMove}
    className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-5 border"
  >
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800">Move Shipment</h2>
      <p className="text-sm text-gray-500 mt-1">
        Transfer shipment to another warehouse
      </p>
    </div>

    {/* Shipment Select */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Select Shipment
      </label>
      <select
        value={shipmentId}
        onChange={(e) => setShipmentId(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="">Choose Shipment</option>
        {shipments.map((s) => (
          <option key={s._id} value={s._id}>
            {s.trackerid}
          </option>
        ))}
      </select>
    </div>

    {/* Warehouse Select */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Destination Warehouse
      </label>
      <select
        value={toWarehouseId}
        onChange={(e) => setToWarehouseId(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="">Choose Warehouse</option>
        {warehouses.map((w) => (
          <option key={w._id} value={w._id}>
            {w.name}
          </option>
        ))}
      </select>
    </div>

    {/* Button */}
    <button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300"
    >
      Move Shipment
    </button>
  </form>
</div>
  );
};

export default MoveShipment;