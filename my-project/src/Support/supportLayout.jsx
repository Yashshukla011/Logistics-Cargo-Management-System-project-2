import { useNavigate, Outlet, useLocation } from "react-router-dom";

const SupportLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role?.toLowerCase?.();

  // ✅ agar /support/create ya /support/my hai → direct child dikhao
  const isChildRoute =
    location.pathname.includes("/support/create") ||
    location.pathname.includes("/support/my") ||
    location.pathname.includes("/support/chat");

  // ✅ CHILD ROUTES SHOW
  if (isChildRoute) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 text-center">

        <h1 className="text-3xl font-bold text-gray-800">
          Support Center
        </h1>

        <p className="text-sm text-gray-500 mt-1 mb-6">
          How can we help you today?
        </p>

        {/* USER */}
        {role === "user" && (
          <div className="space-y-3">

            <button
              onClick={() => navigate("/support/create")}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
            >
              + Create New Ticket
            </button>

            <button
              onClick={() => navigate("/support/my")}
              className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700"
            >
              View My Tickets
            </button>

          </div>
        )}

        {/* ADMIN */}
        {role === "admin" && (
          <button
            onClick={() => navigate("/admin/support")}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800"
          >
            Manage All Tickets
          </button>
        )}

        {!role && (
          <p className="text-sm text-red-500 mt-4">
            User role not found. Please login again.
          </p>
        )}

        <p className="text-xs text-gray-400 mt-6">
          Powered by Support System
        </p>

      </div>
    </div>
  );
};

export default SupportLayout;