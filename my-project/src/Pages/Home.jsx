import React, { useState } from "react";
import axios from "axios";

const Home = () => {
  const [trackerId, setTrackerId] = useState("");
  const [shipment, setShipment] = useState(null);

  const handleSearch = async () => {
    if (!trackerId) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/tracking/${trackerId}`
      );
      setShipment(res.data.shipment);
    } catch (err) {
      setShipment(null);
      alert("Shipment not found");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">

      {/* INPUT */}
      <input
        type="text"
        placeholder="Enter Tracking ID"
        value={trackerId}
        onChange={(e) => setTrackerId(e.target.value)}
        className="border px-4 py-2 rounded"
      />

      {/* BUTTON */}
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Track
      </button>

      {/* RESULT */}
      {shipment && (
        <div className="mt-4 border p-4 rounded">
          <p><strong>ID:</strong> {shipment.trackerid}</p>
          <p><strong>Status:</strong> {shipment.status}</p>
          <p><strong>Receiver:</strong> {shipment.receiverName}</p>
        </div>
      )}

    </div>
  );
};

export default Home;