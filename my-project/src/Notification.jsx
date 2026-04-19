import { useEffect, useState } from "react";
import socket from "./Support/socket";
import { Bell } from "lucide-react";

const NotificationBell = ({ user }) => {
  const [notifications, setNotifications] = useState([]);

 useEffect(() => {
  if (!user?._id) return;

  socket.connect(); // ✅ VERY IMPORTANT

  socket.emit("register", user._id);

  socket.on("connect", () => {
    console.log("🟢 socket connected:", socket.id);
  });

  socket.on("notification", (data) => {
    console.log("🔔 notification:", data);
    setNotifications((prev) => [data, ...prev]);
  });

  return () => {
    socket.off("notification");
  };
}, [user?._id]);
  const unreadCount = notifications.filter((n) => !n.read).length;

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
            <div key={i} className="p-3 border-b hover:bg-gray-50">
              <p className="font-semibold">{n.title}</p>
              <p className="text-sm text-gray-500">{n.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationBell;