import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [data, setData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.role) {
      alert("Please select a role");
      return;
    }

    try {
      await API.post("/users/register", data);
      navigate("/login");
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-gray-200 px-4">
      
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        {/* Full Name */}
        <input
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Username */}
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Password */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Role Dropdown */}
        <select
          name="role"
          onChange={handleChange}
          className="w-full mb-6 px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="subuser">Sub User</option>
        </select>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 transition text-white py-2 rounded-lg font-semibold shadow-md"
        >
          Register
        </button>

        {/* Login Redirect */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;