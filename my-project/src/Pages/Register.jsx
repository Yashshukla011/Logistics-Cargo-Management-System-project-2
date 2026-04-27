import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [file, setFile] = useState(null);

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
     
      const formData = new FormData();

      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("username", data.username);
      formData.append("password", data.password);
      formData.append("role", data.role);
  
      if (file) {
        formData.append("avatar", file);
      }

      await API.post("/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
       alert("Registration successful!");
      navigate("/login");
    } catch (err) {
        alert(err.response?.data?.message || "Registration failed");
    }
  };
    
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-gray-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h2>

        <input
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        />

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        />

        <select
          name="role"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          
        </select>

        {/* 📸 Image Upload */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        <button className="w-full bg-blue-500 text-white py-2 rounded-lg">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;