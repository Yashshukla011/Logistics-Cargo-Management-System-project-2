import { useEffect, useState } from "react";
import socket from "./Support/socket";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotificationBell = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  if (!user?._id) return;

  if (!socket.connected) socket.connect();

  socket.emit("register", user._id);

  const handler = (data) => {
    console.log("🔔 notification:", data);

    setNotifications((prev) => {
      const exists = prev.find(
        (n) =>
          n.message === data.message &&
          n.ticketId === data.ticketId
      );

      if (exists) return prev;
      return [data, ...prev];
    });
  };

  socket.off("notification"); // 🔥 IMPORTANT CLEANUP
  socket.on("notification", handler);

  return () => {
    socket.off("notification", handler);
  };
}, [user?._id]);

  // 🔥 CLICK → OPEN TICKET
const handleClick = (n) => {
  console.log("CLICK:", n);

if (n?.ticketId) {
  if (user?.role === "admin") {
    navigate(`/admin/chat/${n.ticketId}`);

  } else {
navigate(`/support/chat/${n.ticketId}`);  }
}
};

  const unreadCount = notifications.length;

  return (
    <div className="relative cursor-pointer group">

      <Bell className="w-5 h-5 text-black" />

      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
          {unreadCount}
        </span>
      )}

      <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg 
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                      transition-all duration-200 z-50">

        {notifications.length === 0 ? (
          <p className="p-3 text-gray-500">No notifications</p>
        ) : (
          notifications.map((n, i) => (
            <div
              key={i}
              onClick={() => handleClick(n)}
              className="p-3 border-b hover:bg-gray-100 cursor-pointer"
            >
              <p className="font-semibold">
                {n.title || "Notification"}
              </p>
              <p className="text-sm text-gray-500">
                {n.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationBell;