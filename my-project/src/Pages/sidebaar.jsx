import React, { useEffect, useState, useMemo } from "react";
import {
  LayoutDashboard,
  Plus,
  ClipboardList,
  MapPin,
  Headphones,
  User,
  Truck
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const Sidebaar = () => {
  const [user, setUser] = useState(null);

  // safer localStorage read
  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };

    loadUser();

    window.addEventListener("userChanged", loadUser);
    return () => window.removeEventListener("userChanged", loadUser);
  }, []);

  // roles helper (clean logic)
  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";
  const isSubUser = user?.role === "subuser";

  const canViewOrders = isUser || isSubUser;

  const menuClass =
    "group flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all duration-200";

  const iconClass = "text-gray-600 group-hover:text-white";
  const textClass = "text-gray-700 group-hover:text-white";

  const linkClass = ({ isActive }) =>
    `${menuClass} ${
      isActive ? "bg-blue-600 text-white" : "hover:bg-blue-600"
    }`;

  return (
    <div className="flex h-screen">

      {/* SIDEBAR */}
      <div className="w-64 bg-white p-4 space-y-4 border-r">

        {/* DASHBOARD */}
        <NavLink to={isAdmin ? "/admin" : "/user"} className={linkClass}>
          <LayoutDashboard size={20} className={iconClass} />
          <span className={textClass}>Dashboard</span>
        </NavLink>

        {/* CREATE SHIPMENT (only user) */}
        {isUser && (
          <NavLink to="/createshipment" className={linkClass}>
            <Plus size={20} className={iconClass} />
            <span className={textClass}>Create Shipment</span>
          </NavLink>
        )}
      
        {/* ORDERS (user + subuser) */}
        {canViewOrders && (
          <NavLink to="/fetchshipments" className={linkClass}>
            <ClipboardList size={20} className={iconClass} />
            <span className={textClass}>My Orders</span>
          </NavLink>
        )}
{isAdmin && (
  <NavLink to="/payment" className={linkClass}>
    <User size={20} className={iconClass} />
    <span className={textClass}>Payment (Admin)</span>
  </NavLink>
)}

{isUser && (
  <NavLink to="/userpayment" className={linkClass}>
    <User size={20} className={iconClass} />
    <span className={textClass}>My Payments</span>
  </NavLink>
)}
        {/* ADMIN ONLY */}
        {isAdmin && (
          <>
            <NavLink to="/fetchshipments" className={linkClass}>
              <Truck size={20} className={iconClass} />
              <span className={textClass}>All Shipments</span>
            </NavLink>

            <NavLink to="/warehouse" className={linkClass}>
              <MapPin size={20} className={iconClass} />
              <span className={textClass}>Warehouse</span>
            </NavLink>

            <NavLink to="/assignwarehouse" className={linkClass}>
              <MapPin size={20} className={iconClass} />
              <span className={textClass}>Assign Warehouse</span>
            </NavLink>

            <NavLink to="/moveshipment" className={linkClass}>
              <Truck size={20} className={iconClass} />
              <span className={textClass}>Move Shipment</span>
            </NavLink>
          </>
        )}

        {/* COMMON */}
        <NavLink to="/support" className={linkClass}>
          <Headphones size={20} className={iconClass} />
          <span className={textClass}>Support</span>
        </NavLink>

        {/* <NavLink to="/payment" className={linkClass}>
          <User size={20} className={iconClass} />
          <span className={textClass}>Payment</span>
        </NavLink> */}
         
        <NavLink to="/profile" className={linkClass}>
          <User size={20} className={iconClass} />
          <span className={textClass}>Profile</span>
        </NavLink>

      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet />
      </div>

    </div>
  );
};

export default Sidebaar;