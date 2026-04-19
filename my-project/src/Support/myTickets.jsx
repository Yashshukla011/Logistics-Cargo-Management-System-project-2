import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await API.get("/support/my");
        setTickets(res.data.data || []);
      } catch (error) {
        console.log(error);
        setTickets([]);
      }
    };

    fetchTickets();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-600";
      case "in_progress":
        return "bg-yellow-100 text-yellow-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          My Support Tickets
        </h2>

        <span className="text-sm text-gray-500">
          Total: {tickets.length}
        </span>
      </div>

      {/* Empty state */}
      {tickets.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No tickets found 😕
        </div>
      )}

      {/* Ticket Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

        {tickets.map((t) => (
          <div
            key={t._id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 border border-gray-200"
          >

            {/* Subject */}
            <h3 className="text-lg font-semibold text-gray-800">
              {t.subject}
            </h3>

            {/* Message preview */}
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {t.message || "No message provided"}
            </p>

            {/* Status */}
            <div className="mt-3">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusStyle(
                  t.status
                )}`}
              >
                {t.status}
              </span>
            </div>

            {/* Action */}
            <button
              onClick={() => navigate(`/support/chat/${t._id}`)}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Open Chat
            </button>

          </div>
        ))}

      </div>
    </div>
  );
};

export default MyTickets;