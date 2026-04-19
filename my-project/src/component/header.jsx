import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import NotificationBell from "../Notification";

const Header = () => {
  // ✅ FIX 1: initial load from localStorage
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:5000";

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
    } catch (err) {
      console.log(err);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    }
  };

  // 🔥 SEARCH
  const handleSearchKey = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/search?q=${search}`);
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
    <header className="w-full bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm">

      {/* LOGO */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 text-white p-2 rounded-lg">📦</div>
        <h1 className="font-bold text-lg">LogiTrack</h1>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearchKey}
        placeholder="Search shipments..."
        className="px-4 py-2 bg-gray-100 rounded-full w-1/3 outline-none"
      />

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {user && <NotificationBell user={user} />}

        {!user ? (
          <div className="flex items-center gap-3">
            <Link to="/register" className="bg-green-500 text-white px-3 py-1 rounded">
              Register
            </Link>
            <Link to="/login" className="bg-blue-600 text-white px-3 py-1 rounded">
              Login
            </Link>
          </div>
        ) : (
          <>
            <span className="text-sm bg-gray-100 px-2 py-1 rounded capitalize">
              {user.role}
            </span>

            {/* 🔥 IMAGE FIX (cache busting) */}
            <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white font-bold">
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
              className="bg-red-500 text-white px-3 py-1 rounded"
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