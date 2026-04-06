import { useEffect, useState } from "react";
import API from "../api/axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalShipments: 0,
    delivered: 0,
    pending: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  const getStats = async () => {
    try {
      const res = await API.get("/admin/dashboard");
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Shipments */}
        <div className="bg-white shadow rounded-2xl p-5">
          <h2 className="text-gray-500">Total Shipments</h2>
          <p className="text-2xl font-bold">{stats.totalShipments}</p>
        </div>

        {/* Delivered */}
        <div className="bg-green-100 shadow rounded-2xl p-5">
          <h2 className="text-gray-500">Delivered</h2>
          <p className="text-2xl font-bold">{stats.delivered}</p>
        </div>

        {/* Pending */}
        <div className="bg-yellow-100 shadow rounded-2xl p-5">
          <h2 className="text-gray-500">Pending</h2>
          <p className="text-2xl font-bold">{stats.pending}</p>
        </div>

        {/* Revenue */}
        <div className="bg-blue-100 shadow rounded-2xl p-5">
          <h2 className="text-gray-500">Revenue (₹)</h2>
          <p className="text-2xl font-bold">{stats.revenue}</p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;