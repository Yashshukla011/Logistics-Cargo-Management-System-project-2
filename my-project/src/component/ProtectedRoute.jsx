import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roleAllowed }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  console.log("ProtectedRoute user:", user); // ✅ debug

  // ❌ not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ❌ role mismatch
  if (roleAllowed && user.role !== roleAllowed) {
    console.log("Role mismatch:", user.role, roleAllowed);

    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/user"}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;