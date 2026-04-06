import { useState } from "react";
import API from "../api/axios";

const CreateShipment = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    receiverName: "",
    receiverAddress: "",
    receiverEmail: "",
    weight: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      if (loading) return;
    try {
      await API.post("/shipments", data);
      alert("Shipment Created ✅");
    } catch {
      alert("Error ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-[350px]">
        <h2 className="text-xl font-semibold text-center mb-4">
          Create Shipment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            name="receiverName" placeholder="Receiver Name" onChange={handleChange} />

          <input className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            name="receiverAddress" placeholder="Address" onChange={handleChange} />

          <input className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            name="receiverEmail" placeholder="Email" onChange={handleChange} />

          <input className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            name="weight" placeholder="Weight" onChange={handleChange} />

          <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateShipment;