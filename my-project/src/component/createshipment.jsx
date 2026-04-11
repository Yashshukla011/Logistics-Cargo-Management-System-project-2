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
  setLoading(true);

  const payload = {
    ...data,
    weight: Number(data.weight),
  };

  try {
    await API.post("/shipments", payload, {
      withCredentials: true,
    });

    alert("Shipment Created ✅");
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
    
    {/* Header */}
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">
      Create Shipment
    </h2>
    <p className="text-center text-sm text-gray-500 mb-6">
      Enter receiver details to book order
    </p>

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        name="receiverName"
        placeholder="Receiver Name"
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />

      <input
        name="receiverAddress"
        placeholder="Address"
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />

      <input
        name="receiverEmail"
        placeholder="Email"
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />

      <input
        name="weight"
        placeholder="Weight (kg)"
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />

      {/* Button */}
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:scale-[1.02] active:scale-95 transition"
      >
        Create Shipment
      </button>

    </form>
  </div>
</div>
  );
};

export default CreateShipment;