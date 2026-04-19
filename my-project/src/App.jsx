import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Sidebar from "./Pages/sidebaar";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AdminDashboard from "./Dashboard/admin";
import Header from "./component/header";
import CreateShipment from "./component/createshipment";
import FetchShipment from "./component/fetchshipment";
import Profile from "./profile/profile";
import SearchPage from "./Search/seacrch";
import Warehouse from "./warehouse/warehouse";
import Assignwarehouse from "./warehouse/Assignment";
import Move from "./warehouse/moveshipment";
import UserDashboard from "./Pages/UserDashboard";
import Payment from "./component/payment";

// SUPPORT
import SupportLayout from "./Support/supportLayout";
import CreateTicket from "./Support/createTicket";
import MyTickets from "./Support/myTickets";
import TicketChat from "./Support/Ticketchats";
import AdminTickets from "./Support/Admintickets";
import AdminChat from "./Support/Adminchat";

/* ---------------- PROTECTED ROUTE ---------------- */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Login />;

  if (!allowedRoles.includes(user.role)) {
    return <h1 style={{ padding: "20px" }}>Access Denied ❌</h1>;
  }

  return children;
};

function App() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const refresh = () => setKey((prev) => prev + 1);

    window.addEventListener("userChanged", refresh);
    return () => window.removeEventListener("userChanged", refresh);
  }, []);

  return (
    <Router key={key}>
      <Header />

      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<SearchPage />} />

        {/* PROTECTED LAYOUT */}
        <Route path="/" element={<Sidebar />}>


          {/* DASHBOARDS */}
          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="user"
            element={
              <ProtectedRoute allowedRoles={["user", "subuser"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />


          {/* SHIPMENTS */}
          <Route
            path="createshipment"
            element={
              <ProtectedRoute allowedRoles={["user", "subuser", "admin"]}>
                <CreateShipment />
              </ProtectedRoute>
            }
          />

          <Route
            path="fetchshipments"
            element={
              <ProtectedRoute allowedRoles={["admin", "user", "subuser"]}>
                <FetchShipment />
              </ProtectedRoute>
            }
          />


          {/* ADMIN ONLY */}
          <Route
            path="warehouse"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Warehouse />
              </ProtectedRoute>
            }
          />

          <Route
            path="assignwarehouse"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Assignwarehouse />
              </ProtectedRoute>
            }
          />

          <Route
            path="moveshipment"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Move />
              </ProtectedRoute>
            }
          />


          {/* PAYMENT */}
          <Route
            path="payment"
            element={
              <ProtectedRoute allowedRoles={["admin","user", "subuser"]}>
                <Payment />
              </ProtectedRoute>
            }
          />

       
          {/* PROFILE */}
          <Route
            path="profile"
            element={
              <ProtectedRoute allowedRoles={["admin", "user", "subuser"]}>
                <Profile />
              </ProtectedRoute>
            }
          />


          {/* ================= SUPPORT (FIXED STRUCTURE) ================= */}

          <Route
            path="support"
            element={
              <ProtectedRoute allowedRoles={["admin", "user", "subuser"]}>
                <SupportLayout />
              </ProtectedRoute>
            }
          >
            {/* USER + SUBUSER */}
            <Route
              path="create"
              element={
                <ProtectedRoute allowedRoles={["user", "subuser"]}>
                  <CreateTicket />
                </ProtectedRoute>
              }
            />

            <Route
              path="my"
              element={
                <ProtectedRoute allowedRoles={["user", "subuser"]}>
                  <MyTickets />
                </ProtectedRoute>
              }
            />

            <Route
              path="chat/:id"
              element={
                <ProtectedRoute allowedRoles={["user", "subuser"]}>
                  <TicketChat />
                </ProtectedRoute>
              }
            />
          </Route>


          {/* ADMIN SUPPORT */}
          <Route
            path="admin/support"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminTickets />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin/chat/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminChat />
              </ProtectedRoute>
            }
          />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;