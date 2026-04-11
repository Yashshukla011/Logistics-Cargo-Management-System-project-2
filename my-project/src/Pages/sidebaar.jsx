import React from "react";
import {
  LayoutDashboard,
  Plus,
  ClipboardList,
  MapPin,
  CreditCard,
  Headphones,
  User
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const Sidebaar = () => {
  const menuClass =
    "group flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all duration-200";

  const iconClass = "text-gray-600 group-hover:text-white";
  const textClass = "text-gray-700 group-hover:text-white";

  return (
    <div className="flex h-screen">

     
      <div className="w-64 bg-white p-4 space-y-4 border-r">

       
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `${menuClass} ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-blue-600"
            }`
          }
        >
          <LayoutDashboard
            size={20}
            className={`${iconClass}`}
          />
          <span className={`${textClass}`}>Dashboard</span>
        </NavLink>

       
        <NavLink
          to="/createshipment"
          className={({ isActive }) =>
            `${menuClass} ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-blue-600"
            }`
          }
        >
          <Plus size={20} className={iconClass} />
          <span className={textClass}>Book Order</span>
        </NavLink>

        
        <NavLink
          to="/fetchshipments"
          className={({ isActive }) =>
            `${menuClass} ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-blue-600"
            }`
          }
        >
          <ClipboardList size={20} className={iconClass} />
          <span className={textClass}>My Orders</span>
        </NavLink>

        
        <NavLink
          to="/track"
          className={({ isActive }) =>
            `${menuClass} ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-blue-600"
            }`
          }
        >
          <MapPin size={20} className={iconClass} />
          <span className={textClass}>Track Order</span>
        </NavLink>

       
        <NavLink
          to="/payment"
          className={({ isActive }) =>
            `${menuClass} ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-blue-600"
            }`
          }
        >
          <CreditCard size={20} className={iconClass} />
          <span className={textClass}>Payment</span>
        </NavLink>

        
        <NavLink
          to="/support"
          className={({ isActive }) =>
            `${menuClass} ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-blue-600"
            }`
          }
        >
          <Headphones size={20} className={iconClass} />
          <span className={textClass}>Support</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${menuClass} ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-blue-600"
            }`
          }
        >
          <User size={20} className={iconClass} />
          <span className={textClass}>Profile</span>
        </NavLink>

      </div>

      
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet />
      </div>

    </div>
  );
};

export default Sidebaar;