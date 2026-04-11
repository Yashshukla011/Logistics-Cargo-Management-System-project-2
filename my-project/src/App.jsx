import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Pages/sidebaar";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AdminDashboard from "./Dashboard/admin";
import Header from "./component/header";
import CreateShipment from "./component/createshipment";
import FetchShipment from "./component/fetchshipment";
import Profile from "./profile/profile";
import SearchPage from "./Search/seacrch";
function App() {
  return (
    <Router>
      <Header />

      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
<Route path="/fetchshipments" element={<FetchShipment />} />
        <Route path="/search" element={<SearchPage />} />
        {/* Layout */}
        <Route path="/" element={<Sidebar />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="createshipment" element={<CreateShipment />} />
          <Route path="profile" element={<Profile />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;