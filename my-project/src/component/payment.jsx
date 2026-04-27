import { useEffect, useState } from "react";
import API from "../api/axios";

const AdminRevenue = () => {

  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidCount: 0,
    pendingCount: 0
  });

  const [payments, setPayments] = useState([]);

  const fetchStats = async () => {
    try {
      const res = await API.get("/revenue/stats");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await API.get("/revenue/recent");

      console.log("ADMIN PAYMENTS:", res.data);

      // SAFE: handle empty or wrong response
      setPayments(res.data?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchPayments();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">
        💰 Admin Revenue Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500">Total Revenue</h2>
          <p className="text-2xl font-bold">₹{stats.totalRevenue}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500">Paid Payments</h2>
          <p className="text-2xl font-bold text-green-600">
            {stats.paidCount}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500">Pending Payments</h2>
          <p className="text-2xl font-bold text-red-500">
            {stats.pendingCount}
          </p>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white p-4 rounded shadow">

        <h2 className="font-semibold mb-3">
          📦 Recent Payments
        </h2>

        <table className="w-full text-sm">

          <thead>
            <tr className="text-left border-b">
              <th>Tracker</th>
              <th>Receiver</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            {payments.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No payments found
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p._id} className="border-b">

                  {/* FIXED SAFE FIELDS */}
                  <td>{p.shipment?.tracker || "N/A"}</td>
                  <td>{p.shipment?.receiver || "N/A"}</td>
                  <td>₹{p.amount || 0}</td>
                  <td>
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AdminRevenue;