import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Component/Header";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import CreateShipment from "./Component/createshipment";
import MyShipments from "./Component/fetchshipment";
import UpdateShipment from "./Component/update";
import AdminDashboard from "./Dashboard/admin";
function App() {
  return (
    <Router>
      <Header />

 <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/admindashboard" element={<AdminDashboard />} />
  <Route path="/createshipment" element={<CreateShipment />} />
  <Route path="/myshipments" element={<MyShipments />} />
  <Route path="/update-shipment/:id" element={<UpdateShipment />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
</Routes>
    </Router>
  );
}

export default App;