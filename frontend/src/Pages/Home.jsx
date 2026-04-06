// src/pages/Home.jsx
import React, { useState } from "react";
import axios from "axios";

const Home = () => {
  const [trackerId, setTrackerId] = useState("");
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackerId) return;

    try {
      setLoading(true);
      // Public shipment details API
      const res = await axios.get(
        `http://localhost:5000/api/v1/tracking/${trackerId}`
      );
      setShipment(res.data.shipment);
    } catch (err) {
      setShipment(null);
      alert(err.response?.data?.message || "Shipment not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Shipment Tracker</h1>

      {/* Tracker ID Search */}
      <form
        className="flex flex-col md:flex-row gap-4 items-center"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          placeholder="Enter Tracker ID"
          value={trackerId}
          onChange={(e) => setTrackerId(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/3"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {/* Shipment Details */}
      {loading && <p className="mt-6">Loading...</p>}

      {shipment && (
        <div className="mt-6 border rounded p-4 shadow space-y-2">
          <h2 className="text-xl font-semibold">Shipment Details</h2>
          <p>
            <strong>Tracker ID:</strong> {shipment.trackerid}
          </p>
          <p>
            <strong>Receiver Name:</strong> {shipment.receiverName || shipment.receiver}
          </p>
          <p>
            <strong>Receiver Email:</strong> {shipment.receiverEmail || shipment.receiverEmail}
          </p>
          <p>
            <strong>Weight:</strong> {shipment.weight} kg
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded ${
                shipment.status === "created"
                  ? "bg-yellow-200 text-yellow-800"
                  : shipment.status === "shipped"
                  ? "bg-blue-200 text-blue-800"
                  : "bg-green-200 text-green-800"
              }`}
            >
              {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
            </span>
          </p>

          {/* Optional: Status history */}
{shipment.statusHistory && shipment.statusHistory.length > 0 && (
  <div>
    <strong>Status History:</strong>
    <ul className="list-disc list-inside">
      {shipment.statusHistory.map((h, idx) => (
        <li key={idx}>
          {h.status} - {h.updatedAt ? new Date(h.updatedAt).toLocaleString() : "Date not available"} 
          {h.location && ` (Location: ${h.location})`}
        </li>
      ))}
    </ul>
  </div>
)}
        </div>
      )}

      {!shipment && !loading && trackerId && (
        <p className="mt-6 text-gray-500">No shipment found for this Tracker ID</p>
      )}
    </div>
  );
};

export default Home;