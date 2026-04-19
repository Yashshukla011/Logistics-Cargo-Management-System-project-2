import { useEffect, useState } from "react";
import API from "../api/axios";
import { Plus, Box } from "lucide-react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const [stats, setStats] = useState({
    totalShipments: 0,
    delivered: 0,
    pending: 0,
    revenue: 0,
  });

  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ SAFE USER
  const user = JSON.parse(localStorage.getItem("user") || "{}");

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
      case "pending_payment":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ✅ FIXED STATS API (ADMIN vs USER)
  const getStats = async () => {
  try {
    const res = await API.get("/shipments/my");

    const data = Array.isArray(res.data?.data)
      ? res.data.data
      : [];

    setShipments(data);

    const totalShipments = data.length;

    const delivered = data.filter(s => s.status === "delivered").length;

    const pending = data.filter(s =>
      ["created", "packed", "in_transit"].includes(s.status)
    ).length;

    const revenue = data.reduce((sum, s) => sum + (s.price || 0), 0);

    setStats({
      totalShipments,
      delivered,
      pending,
      revenue,
    });

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
  // ✅ SAFE SHIPMENTS FETCH
  const getShipments = async () => {
    try {
      const res = await API.get("/shipments/my");

      const data = Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setShipments(data);
    } catch (err) {
      console.error("Shipments error:", err);
      setShipments([]);
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

  // ✅ SORT + RECENT 3
  const recentShipments = [...shipments]
    .sort((a, b) => {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    })
    .slice(0, 3);

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
              {recentShipments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No orders found 🚫
                  </td>
                </tr>
              ) : (
                recentShipments.map((s, index) => (
                  <tr key={s._id} className="border-b hover:bg-gray-50">

                    <td className="p-3 font-medium">
                      ORD-{s.trackerid?.slice(-6) || index + 1}
                    </td>

                    <td className="p-3 text-gray-600">
                      {s.sender?.fullName || "Unknown"} → {s.receiverName || "N/A"}
                    </td>

                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(s.status)}`}>
                        {s.status}
                      </span>
                    </td>

                    <td className="p-3">
                      {s.createdAt
                        ? new Date(s.createdAt).toDateString()
                        : "N/A"}
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

        {/* VIEW ALL */}
        <div className="flex justify-center py-5">
          <Link
            to="/fetchshipments"
            className="bg-black text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
          >
            View All Orders ({shipments.length})
          </Link>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;