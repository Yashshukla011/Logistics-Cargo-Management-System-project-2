import { useEffect, useState } from "react";
import API from "../api/axios";

const MyShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // 📦 FETCH SHIPMENTS
  const fetchShipments = async () => {
    try {
      let res;

      if (user?.role === "admin") {
        res = await API.get("/shipments/all");
      } else {
        res = await API.get("/shipments/my");
      }

      setShipments(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setShipments([]);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  // 🔄 STATUS UPDATE (ADMIN)
  const handleUpdate = async () => {
    if (!selectedId) return;

    const shipment = shipments.find((s) => s._id === selectedId);

    if (shipment?.status === status) {
      alert("Same status select mat karo ❌");
      return;
    }

    try {
      setLoading(true);

      await API.patch(`/shipments/${selectedId}/status`, {
        status,
        location,
      });

      alert("Status updated ✅");
      fetchShipments();

      setSelectedId(null);
      setStatus("");
      setLocation("");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error ❌");
    } finally {
      setLoading(false);
    }
  };

  // 💳 PAYMENT FUNCTION
  const handlePayment = async (shipment) => {
    try {
      const { data } = await API.post("/payment/create-order", {
        shipmentId: shipment._id,
      });

      const order = data.order;

      const options = {
        key: "YOUR_RAZORPAY_KEY",
        amount: order.amount,
        currency: "INR",
        name: "Shipment Payment",
        description: shipment.trackerid,
        order_id: order.id,

        handler: async function (response) {
          await API.post("/payment/verify-payment", response);
          alert("Payment Successful ✅");
          fetchShipments();
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      alert("Payment Failed ❌");
    }
  };

  // 🔎 SEARCH
  const filtered = shipments.filter((s) =>
    `${s.receiverName} ${s.trackerid} ${s.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* SEARCH */}
      <input
        className="w-full max-w-xl border p-2 rounded mb-4"
        placeholder="Search shipments..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">

          {/* HEADER */}
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Receiver</th>
              <th>Tracker</th>
              <th>Status</th>
              <th>Warehouse</th>
              <th>Weight</th>
              <th>Payment</th>
              <th>Action</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-6">
                  No shipments found
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s._id} className="border-t">

                  <td className="p-3 font-medium">{s.receiverName}</td>
                  <td className="text-blue-600">{s.trackerid}</td>

                  <td>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                      {s.status}
                    </span>
                  </td>

                  <td>
                    {s.currentWarehouse?.name || "Not Assigned"}
                  </td>

                  <td>{s.weight} kg</td>

                  {/* 💳 PAYMENT COLUMN */}
                  <td>
                    {s.paymentStatus === "PAID" ? (
                      <span className="text-green-600 font-bold">
                        PAID
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePayment(s)}
                        className="bg-orange-500 text-white px-3 py-1 rounded text-xs"
                      >
                        Pay ₹{s.price}
                      </button>
                    )}
                  </td>

                  {/* ADMIN ACTION */}
                  <td>
                    {user?.role === "admin" ? (
                      <button
                        onClick={() => setSelectedId(s._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                      >
                        Update
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        View Only
                      </span>
                    )}
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL (ADMIN ONLY) */}
      {selectedId && user?.role === "admin" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-5 rounded-xl w-80">

            <h2 className="font-semibold mb-3">Update Shipment</h2>

            <select
              className="w-full border p-2 mb-3"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="created">Created</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="in_transit">In Transit</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>

            <input
              className="w-full border p-2 mb-3"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white w-full py-2"
            >
              {loading ? "Updating..." : "Save"}
            </button>

            <button
              onClick={() => setSelectedId(null)}
              className="w-full mt-2 bg-gray-200 py-2"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default MyShipments;