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
    <div className="flex justify-center items-center min-h-screen">
      <form className="bg-white p-6 rounded shadow space-y-4" onSubmit={handleMove}>

        <h2 className="text-xl font-bold">Move Shipment</h2>

        <select
          value={shipmentId}
          onChange={(e) => setShipmentId(e.target.value)}
        >
          <option value="">Select Shipment</option>

          {shipments.map((s) => (
            <option key={s._id} value={s._id}>
              {s.trackerid}
            </option>
          ))}
        </select>

        <select
          value={toWarehouseId}
          onChange={(e) => setToWarehouseId(e.target.value)}
        >
          <option value="">Select Destination Warehouse</option>

          {warehouses.map((w) => (
            <option key={w._id} value={w._id}>
              {w.name}
            </option>
          ))}
        </select>

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Move
        </button>

      </form>
    </div>
  );
};

export default MoveShipment;