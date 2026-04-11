import { useEffect, useState } from "react";
import API from "../api/axios";

const MoveShipment = () => {
  const [shipments, setShipments] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [shipmentId, setShipmentId] = useState("");
  const [toWarehouseId, setToWarehouseId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const shipRes = await API.get("/shipments/my");
      const wareRes = await API.get("/warehouse/");

      setShipments(shipRes.data.message || []);
      setWarehouses(wareRes.data.warehouses || []);
    };

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
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleMove} className="bg-white p-6 rounded shadow space-y-4">

        <h2 className="text-xl font-bold">Move Shipment</h2>

        <select onChange={(e) => setShipmentId(e.target.value)}>
          <option>Select Shipment</option>
          {shipments.map((s) => (
            <option key={s._id} value={s._id}>
              {s.trackerid}
            </option>
          ))}
        </select>

        <select onChange={(e) => setToWarehouseId(e.target.value)}>
          <option>Select Destination Warehouse</option>
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