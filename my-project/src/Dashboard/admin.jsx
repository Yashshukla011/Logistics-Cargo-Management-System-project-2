import { useEffect, useState } from "react";
import API from "../api/axios";
import { Plus, Box } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalShipments: 0,
    delivered: 0,
    pending: 0,
    revenue: 0,
  });

  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ STATUS COLOR SAFE (handles wrong DB values too)
  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-600";
      case "in_transit":
        return "bg-blue-100 text-blue-600";
      case "packed":
        return "bg-purple-100 text-purple-600";
      case "created":
        return "bg-yellow-100 text-yellow-600";

      // ❗ fallback for old wrong data like pending_payment
      case "pending_payment":
        return "bg-red-100 text-red-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ✅ STATS API
  const getStats = async () => {
    try {
      const res = await API.get("/admin/dashboard");
      setStats(res.data);
    } catch (error) {
      console.error("Stats error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SHIPMENTS API
  const getShipments = async () => {
    try {
      const res = await API.get("/shipments/my");
      setShipments(res.data.message || res.data || []);
    } catch (err) {
      console.error("Shipments error:", err);
    }
  };

  useEffect(() => {
    getStats();
    getShipments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-blue-600 text-lg animate-pulse">
        🚀 Loading Dashboard...
      </div>
    );
  }

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">

    {/* HEADER */}
    <div className="mb-8">
      <h1 className="text-4xl font-extrabold text-gray-800">
        Welcome back, {user?.role || "User"}!
      </h1>
      <p className="text-gray-500 mt-1">
        Here's what's happening with your orders today.
      </p>
    </div>

    {/* STATS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-gray-500 text-sm">Total Shipments</h2>
        <p className="text-3xl font-bold mt-2">{stats.totalShipments}</p>
      </div>

      <div className="bg-green-100 shadow-xl rounded-2xl p-6">
        <h2 className="text-green-700 text-sm">Delivered</h2>
        <p className="text-3xl font-bold mt-2">{stats.delivered}</p>
      </div>

      <div className="bg-yellow-100 shadow-xl rounded-2xl p-6">
        <h2 className="text-yellow-700 text-sm">Pending</h2>
        <p className="text-3xl font-bold mt-2">{stats.pending}</p>
      </div>

      <div className="bg-blue-100 shadow-xl rounded-2xl p-6">
        <h2 className="text-blue-700 text-sm">Revenue</h2>
        <p className="text-3xl font-bold mt-2">₹ {stats.revenue}</p>
      </div>
    </div>

    {/* CTA */}
    <div className="mt-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 flex justify-between items-center shadow-lg">

      <div className="text-white">
        <h2 className="text-2xl font-bold mb-2">
          Ready to ship something?
        </h2>
        <p className="text-blue-100 mb-4">
          Book a new order and track it from pickup to delivery
        </p>

        <Link
          to="/createshipment"
          className="inline-flex items-center gap-1 bg-white text-blue-600 px-3 py-1.5 rounded-lg"
        >
          <Plus size={18} />
          Book New Order
        </Link>
      </div>

      <div className="hidden md:block opacity-20">
        <Box size={120} />
      </div>
    </div>

    {/* TABLE */}
    <div className="mt-10 bg-white shadow-lg rounded-xl overflow-hidden">

      <div className="p-5 border-b">
        <h2 className="text-xl font-bold">Recent Orders</h2>
        <p className="text-sm text-gray-500">
          Track and manage your shipments
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Sender → Receiver</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Price</th>
            </tr>
          </thead>

          <tbody>
            {shipments.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No orders found 🚫
                </td>
              </tr>
            ) : (
              shipments.map((s, index) => (
                <tr key={s._id} className="border-b hover:bg-gray-50">

                  <td className="p-3 font-medium">
                    ORD-2024-00{index + 1}
                  </td>

                  <td className="p-3 text-gray-600">
                    {s.sender?.fullName || "Unknown"} → {s.receiverAddress || "N/A"}
                  </td>

                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(s.status)}`}>
                      {s.status}
                    </span>
                  </td>

                  <td className="p-3">
                    {s.createdAt ? new Date(s.createdAt).toDateString() : "N/A"}
                  </td>

                  <td className="p-3 font-semibold text-green-600">
                    ₹ {s.price || 0}
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* ✅ VIEW ALL BUTTON (OUTSIDE TABLE, CENTER PROPERLY) */}
      <div className="flex justify-center py-5">
        <Link
          to="/fetchshipments"
          className="bg-black text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
        >
          View All Orders
        </Link>
      </div>

    </div>
  </div>
);
}

export default Dashboard;