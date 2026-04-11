import { useEffect, useState } from "react";
import API from "../api/axios";

const MyShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [showUpdate, setShowUpdate] = useState(null);
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(false);

  // ✅ FETCH DATA
  const fetchShipments = async () => {
    try {
      const res = await API.get("/shipments/my");
      setShipments(res.data?.message || res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  // ✅ STATUS UPDATE (FIXED PROPERLY)
  const handleUpdate = async (id) => {
    if (updating) return;

    if (!status) {
      alert("Please select status");
      return;
    }

    try {
      setUpdating(true);

      await API.patch(`/shipments/${id}/status`, {
        status,
        location,
      });

      // 🔥 IMPORTANT: ALWAYS REFRESH FROM SERVER
      await fetchShipments();

      alert("Updated Successfully ✅");

      // reset modal
      setShowUpdate(null);
      setStatus("");
      setLocation("");

    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Update failed ❌");
    } finally {
      setUpdating(false);
    }
  };

  // ✅ SEARCH FILTER
  const filteredShipments = shipments.filter((s) =>
    s.receiverName?.toLowerCase().includes(search.toLowerCase()) ||
    s.trackerid?.toLowerCase().includes(search.toLowerCase()) ||
    s.status?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ STATUS COLORS
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
      case "shipped":
        return "bg-indigo-100 text-indigo-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* SEARCH */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="🔍 Search shipments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-2xl border px-4 py-2 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">

        <div className="p-5 border-b">
          <h2 className="text-xl font-bold">My Shipments</h2>
          <p className="text-sm text-gray-500">
            Track all your orders in one place
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">Receiver</th>
                <th className="p-3 text-left">Tracker ID</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Weight</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No shipments found 🚫
                  </td>
                </tr>
              ) : (
                filteredShipments.map((s) => (
                  <tr key={s._id} className="border-b hover:bg-gray-50">

                    <td className="p-3 font-medium">{s.receiverName}</td>

                    <td className="p-3 text-gray-600">{s.trackerid}</td>

                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(s.status)}`}>
                        {s.status}
                      </span>
                    </td>

                    <td className="p-3">{s.weight} kg</td>

                    <td className="p-3">
                      <button
                        onClick={() => setShowUpdate(s._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs"
                      >
                        Update
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* MODAL */}
      {showUpdate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-5 rounded-xl w-[320px] shadow-lg">

            <h3 className="font-bold mb-3">Update Shipment</h3>

            <select
              className="w-full border p-2 rounded mb-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="created">Created</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="in_transit">In Transit</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>

            <input
              className="w-full border p-2 rounded mb-3"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <div className="flex gap-2">

              <button
                disabled={updating}
                onClick={() => handleUpdate(showUpdate)}
                className="bg-green-500 text-white px-3 py-2 rounded w-full disabled:opacity-50"
              >
                {updating ? "Updating..." : "Save"}
              </button>

              <button
                onClick={() => {
                  setShowUpdate(null);
                  setStatus("");
                  setLocation("");
                }}
                className="bg-gray-300 px-3 py-2 rounded w-full"
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MyShipments;