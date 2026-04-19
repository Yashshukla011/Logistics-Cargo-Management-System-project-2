import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/support/all").then((res) =>
      setTickets(res.data.data)
    );
  }, []);

  const getStatusColor = (status) => {
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

      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Admin Support Tickets
        </h2>

        <span className="text-sm text-gray-500">
          Total: {tickets.length}
        </span>
      </div>


      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

        {tickets.map((t) => (
          <div
            key={t._id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 border border-gray-200"
          >

   
            <h3 className="text-lg font-semibold text-gray-800">
              {t.subject}
            </h3>

            
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {t.message || "No message provided"}
            </p>

          
            <div className="mt-3">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                  t.status
                )}`}
              >
                {t.status}
              </span>
            </div>

            
            <button
              onClick={() => navigate(`/admin/chat/${t._id}`)}
              className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Open Chat
            </button>

          </div>
        ))}

      </div>
    </div>
  );
};

export default AdminTickets;