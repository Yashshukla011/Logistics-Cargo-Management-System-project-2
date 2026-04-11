import { useState } from "react";
import API from "../api/axios";

const CreateWarehouse = () => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    location: "",
    capacity: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
  
    try {
      setLoading(true);

      await API.post("/warehouse/create", data);

      alert("Warehouse Created Successfully ✅");

      // reset form
      setData({
        name: "",
        location: "",
        capacity: "",
      });

    } catch (err) {
      alert(err.response?.data?.message || "Error creating warehouse ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-6">

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create Warehouse
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Warehouse Name"
            value={data.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* Location */}
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={data.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* Capacity */}
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={data.capacity}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-medium transition ${
              loading
                ? "bg-gray-400"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Creating..." : "Create Warehouse"}
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default CreateWarehouse;