import { useState } from "react";
import API from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateShipment = () => {
  const { id } = useParams(); // ✅ ID URL से
  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!status) {
      alert("Please select status ⚠️");
      return;
    }

    try {
      setLoading(true);

      console.log("ID:", id);
      console.log("Sending:", { status, location });

      const res = await API.patch(`/shipments/${id}/status`, {
        status,
        location,
      });

      console.log("RESPONSE:", res.data);

      alert("Updated ✅");

      // ✅ redirect back
      navigate("/myshipments");

    } catch (err) {
      console.log("ERROR:", err.response?.data);

      alert(
        err.response?.data?.message ||
        "Update failed ❌ (check status flow)"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-[350px]">
        
        <h2 className="text-xl font-semibold text-center mb-4">
          Update Shipment
        </h2>

        {/* ✅ ID visible */}
        <p className="text-xs text-gray-500 mb-3 break-all">
          Shipment ID: {id || "Not Found ❌"}
        </p>

        <div className="space-y-3">

          {/* ✅ STATUS DROPDOWN */}
          <select
            value={status}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="in_transit">In Transit</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
          </select>

          {/* ✅ LOCATION */}
          <input
            value={location}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter Location"
            onChange={(e) => setLocation(e.target.value)}
          />

          {/* ✅ BUTTON */}
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`w-full py-2 rounded-md text-white ${
              loading
                ? "bg-gray-400"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Updating..." : "Update"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default UpdateShipment;