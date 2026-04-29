import { Link, useNavigate } from "react-router-dom";
import { Search, LogOut } from "lucide-react";

import { useEffect, useState } from "react";
import API from "../api/axios";
import NotificationBell from "../Notification";
import socket from "../Support/socket";
const Header = () => {
  // ✅ FIX 1: initial load from localStorage
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

const BASE_URL = "https://logistics-cargo-management-system.onrender.com";

  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const res = await API.get("/user/me");

      const freshUser = res.data.user;

      // ✅ FIX 2: sync localStorage + state
      localStorage.setItem("user", JSON.stringify(freshUser));
      setUser(freshUser);

    } catch (err) {
      console.log("USER FETCH ERROR:", err.response?.status);

      if (err.response?.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  };

  // ✅ load on mount
  useEffect(() => {
    fetchUser();
  }, []);
useEffect(() => {
  if (!user?._id) return;

  // 🔥 prevent multiple connects
  if (!socket.connected) {
    socket.connect();
  }

  socket.emit("register", user._id);

  const handleNotification = (data) => {
    console.log("🔔 Notification:", data);
  };

  socket.on("notification", handleNotification);

  return () => {
    socket.off("notification", handleNotification);
  };
}, [user?._id]);
  // ✅ FIX 3: real-time sync (LOGIN / PROFILE UPDATE)
  useEffect(() => {
    const updateUser = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUser(updatedUser);
    };

    window.addEventListener("userChanged", updateUser);

    return () => window.removeEventListener("userChanged", updateUser);
  }, []);

  // 🔥 LOGOUT
  const handleLogout = async () => {
    try {
      await API.post("/user/logout");
      navigate("/")
    } catch (err) {
      console.log(err);
    } finally {
       socket.disconnect();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/");
    }
  };

  // 🔥 SEARCH
  const handleSearchKey = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/search?q=${search}`);
       setSearch("")
    }
   
  };

  const getInitials = (name = "") => {
    const words = name.trim().split(" ");
    if (!words[0]) return "U";
    return words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : words[0][0].toUpperCase();
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm px-6 py-3 flex justify-between items-center">

  {/* LOGO */}
  <div className="flex items-center gap-3">
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2.5 rounded-xl shadow-md">
      📦
    </div>
    <h1 className="font-bold text-xl text-gray-800 tracking-wide">
      CargoX
    </h1>
  </div>

  {/* SEARCH */}
  <div className="relative w-1/3">
    <Search
      size={18}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
    />
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onKeyDown={handleSearchKey}
      placeholder="Search shipments..."
      className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-full outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
    />
  </div>

  {/* RIGHT SIDE */}
  <div className="flex items-center gap-4">

    {user && <NotificationBell user={user} />}

    {!user ? (
      <div className="flex items-center gap-3">
        <Link
          to="/register"
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full font-medium shadow transition-all"
        >
          Register
        </Link>

        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium shadow transition-all"
        >
          Login
        </Link>
      </div>
    ) : (
      <>
        <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full capitalize font-medium border border-blue-100">
          {user.role}
        </span>

        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md border-2 border-white">
          {user.avatar ? (
            <img
              src={`${BASE_URL}/${user.avatar.replace(/\\/g, "/")}?t=${Date.now()}`}
              className="w-full h-full object-cover"
              alt="avatar"
            />
          ) : (
            getInitials(user.fullName || user.email)
          )}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium shadow transition-all"
        >
          <LogOut size={16} />
          Logout
        </button>
      </>
    )}
  </div>
</header>
  );
};

export default Header;