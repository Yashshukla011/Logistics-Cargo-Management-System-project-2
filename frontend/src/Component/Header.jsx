import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const data = localStorage.getItem("user");
      if (data && data !== "undefined") {
        setUser(JSON.parse(data));
      }
    } catch {
      localStorage.removeItem("user");
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
  return (
    <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      
      <h1 className="text-xl font-bold text-blue-400">MyApp</h1>

      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-blue-400 transition">Home</Link>
        <Link to="/admindashboard" className="hover:text-blue-400 transition">Admin Dashboard</Link>
           <Link to="/createshipment" className="hover:text-blue-400 transition">Create Shipment</Link>
            <Link to="/myshipments" className="hover:text-blue-400 transition">My Shipments</Link>
             {/* <Link to="/update-shipment" className="hover:text-blue-400 transition">Update Shipment</Link> */}
        {!user ? (
          <>
            <Link to="/login" className="hover:text-blue-400">Login</Link>
            <Link to="/register" className="hover:text-blue-400">Register</Link>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-300">
              {user.username || user.email}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;