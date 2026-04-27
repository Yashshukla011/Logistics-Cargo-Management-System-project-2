import { useEffect, useState } from "react";
import API from "../api/axios";

const UserPayments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await API.get("/payment/my");
        console.log("USER PAYMENTS:", res.data);
        setPayments(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div>
      <h2>💰 My Payments</h2>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Tracker</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((p) => (
            <tr key={p._id}>
              <td>{p.shipment?.tracker || "N/A"}</td>
              <td>₹{p.amount}</td>
              <td>{p.status}</td>
              <td>{new Date(p.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserPayments;