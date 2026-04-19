import axios from "../api/axios";

const PayButton = ({ shipment }) => {

  const handlePay = async () => {
    try {

      const { data } = await axios.post("/payment/create-order", {
        shipmentId: shipment._id,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.order.amount,
        currency: "INR",
        order_id: data.order.id,

        handler: async function (response) {

          await axios.post("/payment/verify-payment", response);

          alert("Payment Successful ✅");
          window.location.reload();
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <button
      onClick={handlePay}
      className="bg-green-600 text-white px-3 py-1 rounded"
    >
      Pay ₹{shipment.price}
    </button>
  );
};

export default PayButton;