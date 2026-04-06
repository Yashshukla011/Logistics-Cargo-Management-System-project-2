import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const MyShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    setUser(data);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/shipments/my");
        setShipments(res.data.message || []);
      } catch (err) {
        console.error(err);
        setShipments([]);
      }
    };

    fetchData();
  }, []);


  const handlePayment = async (shipmentId) => {
    try {
      const { data } =await API.post("/payment/create-order", {
  shipmentId: shipmentId, 
});

      const options = {
        key: "YOUR_KEY_ID",
        amount: data.order.amount,
        currency: "INR",
        name: "MyApp",
        description: "Shipment Payment",
        order_id: data.order.id,

        handler: async function () {
          await API.patch(`/shipments/${shipmentId}/status`, {
            status: "created",
          });

          alert("Payment Successful ✅");

          setShipments((prev) =>
            prev.map((s) =>
              s._id === shipmentId ? { ...s, status: "created" } : s
            )
          );
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
       console.log(err.response?.data);
      alert("Payment failed ❌");
    }
  };

  const handleAdminUpdate = async (id, status) => {
    try {
      await API.patch(`/shipments/${id}/status`, { status });

      alert("Status Updated ✅");

      setShipments((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, status } : s
        )
      );

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      {shipments.length === 0 && <p>No shipments found.</p>}

      {shipments.map((s) => (
        <div key={s._id} className="bg-white p-4 shadow rounded mb-4">
          
          <p className="font-bold">{s.receiverName}</p>
          <p>Status: {s.status}</p>
          <p>Shipment ID: {s._id}</p>
          <p>Tracker ID: {s.trackerid}</p>
          <p>Docket Number: {s.DocketNumber}</p>
          <p>Weight: {s.weight} kg</p>
          <p>Price: ₹{s.price}</p>

          {user?.role !== "admin" && s.status === "pending_payment" && (
            <button
              onClick={() => handlePayment(s._id)}
              className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
            >
              Pay Now
            </button>
          )}

       
          {user?.role === "admin" && (
            <select
              onChange={(e) => handleAdminUpdate(s._id, e.target.value)}
              className="mt-2 p-1 border rounded"
              defaultValue=""
            >
              <option value="" disabled>Update Status</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="in_transit">In Transit</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          )}

          
          {s.statusHistory?.length > 0 && (
            <div className="mt-2">
              <strong>Status History:</strong>
              <ul className="list-disc list-inside">
                {s.statusHistory.map((h, idx) => (
                  <li key={idx}>
                    {h.status} -{" "}
                    {h.updatedAt
                      ? new Date(h.updatedAt).toLocaleString()
                      : "No date"}{" "}
                    {h.location && `(Location: ${h.location})`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyShipments;