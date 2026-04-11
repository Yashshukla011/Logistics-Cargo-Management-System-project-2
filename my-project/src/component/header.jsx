import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import API from "../api/axios";

const Header = () => {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data && data !== "undefined") {
      setUser(JSON.parse(data));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await API.post("/users/logout");
    } catch (err) {
      console.log(err.response?.data);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    }
  };

  // 🔥 ENTER PE SEARCH PAGE (optional)
  const handleSearchKey = (e) => {
    if (e.key === "Enter") {
      navigate(`/search?q=${search}`);
    }
  };

  const getInitials = (email) => {
    if (!email || email.trim() === "") return "Y";

    email = email.trim();

    if (email.includes("@")) {
      const name = email.split("@")[0];
      const parts = name.split(/[._]/);

      if (parts.length > 1) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }

      return parts[0][0].toUpperCase();
    }

    const words = email.split(" ").filter(Boolean);

    return words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : words[0][0].toUpperCase();
  };

  return (
    <header className="w-full bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">

      {/* LOGO */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 text-white p-2 rounded-lg">📦</div>
        <div>
          <h1 className="font-bold text-lg text-gray-800">LogiTrack</h1>
          <p className="text-xs text-gray-500">Logistics Portal</p>
        </div>
      </div>

      {/* 🔥 FRONTEND SEARCH */}
      <div className="flex-1 mx-10">
        <input
          placeholder="Search orders, tracking numbers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKey}
          className="w-full px-4 py-2 bg-gray-100 border rounded-full focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-5">

        {/* BELL */}
        <div className="relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>

        {/* LOGIN / REGISTER */}
        {!user && (
          <>
            <Link
              to="/login"
              className="px-4 py-1 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Register
            </Link>
          </>
        )}

        {/* USER */}
        {user && (
          <>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-gray-500 font-semibold text-2xl capitalize">
                  {user?.role || "User"}
                </p>
              </div>

              <div className="w-9 h-9 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold">
                {getInitials(
                  user.fullName || user.username || user.name || user.email
                )}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-white bg-blue-600 text-sm hover:bg-blue-700 px-3 py-1 rounded-lg transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;