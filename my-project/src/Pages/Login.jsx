import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({
    login: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { password: data.password };

      if (data.login.includes("@")) {
        payload.email = data.login;
      } else {
        payload.username = data.login;
      }

      const res = await API.post("/users/login", payload);

      const user =
        res.data?.data?.user ||
        res.data?.user ||
        res.data?.data;

      if (!user) {
        alert("Login failed");
        return;
      }
console.log(res.data);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/");
      window.location.reload();
      

    } catch (err) {
      console.log(err.response?.data);
      alert("Error in login");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Login
        </h2>

        <input
          name="login"
          placeholder="Email or Username"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;