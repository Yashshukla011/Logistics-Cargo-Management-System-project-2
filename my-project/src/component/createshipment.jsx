import { useEffect, useState } from "react";
import API from "../api/axios";

const CreateShipment = () => {
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]); // ✅ NEW
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
    
 // ✅ NEW
const RATE_PER_KG = 50;

  const [data, setData] = useState({
    receiverName: "",
    receiverAddress: "",
    receiverEmail: "",
    weight: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // ✅ FETCH WAREHOUSES

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    const payload = {
      ...data,
      weight: Number(data.weight),
    };

    try {
      // ✅ 1. CREATE SHIPMENT
      const res = await API.post("/shipments", payload, {
        withCredentials: true,
        
      });

      const shipment = res.data.data || res.data;

      // ✅ 2. ASSIGN WAREHOUSE (IMPORTANT)
      if (selectedWarehouseId) {
        await API.post("/assign-shipment", {
          shipmentId: shipment._id,
          warehouseId: selectedWarehouseId,
        });
      }

      alert("Shipment Created & Assigned ✅");
       setData({
      sender: "",
      receiver: "",
      address: "",
      weight: "",
      phone: "",
    });
    } catch (err) {
      console.log(err.response?.data);
      alert("Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-2xl p-8">

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">
          Create Shipment
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Enter receiver details to book order
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="receiverName"
            placeholder="Receiver Name"
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg"
          />

          <input
            name="receiverAddress"
            placeholder="Address"
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg"
          />

          <input
            name="receiverEmail"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg"
          />
          <h1 className="text-lg font-semibold">
  Rate per KG: <span className="text-green-600">₹{RATE_PER_KG} / kg</span>
</h1>
          <input
            name="weight"
            placeholder="Weight (kg)"
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg"
          />

          {/* ✅ NEW: Warehouse Dropdown */}
          {/* <select
            value={selectedWarehouseId}
            onChange={(e) => setSelectedWarehouseId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg"
          >
            <option value="">Select Warehouse</option>
            {warehouses.map((w) => (
              <option key={w._id} value={w._id}>
                {w.name}
              </option>
            ))}
          </select> */}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg"
          >
            {loading ? "Creating..." : "Create Shipment"}
          </button>
      
        </form>
      </div>
    </div>
  );
};

export default CreateShipment;