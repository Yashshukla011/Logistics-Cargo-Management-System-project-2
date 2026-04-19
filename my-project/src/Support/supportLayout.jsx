import { useNavigate } from "react-router-dom";

const SupportLayout = () => {
  const navigate = useNavigate();

  // ✅ SAFE localStorage parsing
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ normalize role (User / user / ADMIN all handled)
  const role = user?.role?.toLowerCase?.();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 text-center">

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800">
          Support Center
        </h1>

        <p className="text-sm text-gray-500 mt-1 mb-6">
          How can we help you today?
        </p>

        {/* DEBUG (remove later if you want) */}
        {/* <p className="text-xs text-red-500">Role: {role}</p> */}

        {/* USER SECTION */}
        {role === "user" && (
          <div className="space-y-3">

            <button
              onClick={() => navigate("/support/create")}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition shadow-sm"
            >
              + Create New Ticket
            </button>

            <button
              onClick={() => navigate("/support/my")}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition shadow-sm"
            >
              View My Tickets
            </button>

          </div>
        )}

        {/* ADMIN SECTION */}
        {role === "admin" && (
          <div className="space-y-3">

            <button
              onClick={() => navigate("/admin/support")}
              className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition shadow-sm"
            >
              Manage All Tickets
            </button>

          </div>
        )}

        {/* NO ROLE CASE */}
        {!role && (
          <p className="text-sm text-red-500 mt-4">
            User role not found. Please login again.
          </p>
        )}

        {/* FOOTER */}
        <p className="text-xs text-gray-400 mt-6">
          Powered by Support System
        </p>

      </div>
    </div>
  );
};

export default SupportLayout;