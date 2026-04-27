import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import API from "../api/axios";

const COLORS = ["#22c55e", "#f59e0b", "#6366f1"];

const Profile = () => {
  const [data, setData] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const BASE_URL = "http://localhost:5000";

  const getImageUrl = (avatar) =>
    avatar ? `${BASE_URL}/${avatar.replace(/\\/g, "/")}` : "/default.png";

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await API.get("/user/me", { withCredentials: true });

    setData(res.data);

    setForm({
      fullName: res.data?.user?.fullName || "",
      email: res.data?.user?.email || "",
      phone: res.data?.user?.phone || "",
      address: res.data?.user?.address || "",
    });
  };

  const updateProfile = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));

      if (avatarFile) formData.append("avatar", avatarFile);

      await API.put("/user/update", formData, {
        withCredentials: true,
      });

      setAvatarFile(null);
      await fetchProfile();

      alert("Profile Updated Successfully");
    } finally {
      setLoading(false);
    }
  };

  const deleteAvatar = async () => {
    try {
      const confirmDelete = window.confirm("Remove profile photo?");
      if (!confirmDelete) return;

      await API.delete("/avatar", {
        withCredentials: true,
      });

      setAvatarFile(null);
      await fetchProfile();

      alert("Photo Removed Successfully");
    } catch (err) {
      console.log(err);
      alert("Failed To Remove Photo");
    }
  };

  if (!data) return <div className="p-10">Loading...</div>;

  const { user, stats, recentShipments } = data;

  const chartData = [
    { name: "Delivered", value: stats?.delivered || 0 },
    { name: "Pending", value: stats?.pending || 0 },
    { name: "Total", value: stats?.total || 0 },
  ];

  const completion =
    [form.fullName, form.email, form.phone, form.address].filter(Boolean).length * 25;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border rounded-3xl p-6 shadow-lg flex flex-col md:flex-row gap-6 items-center"
        >
          <div className="flex flex-col items-center">
            <label className="relative cursor-pointer">
              <img
                src={`${getImageUrl(user?.avatar)}?t=${Date.now()}`}
                className="w-28 h-28 rounded-full border-4 border-indigo-500 object-cover"
              />

              <input
                hidden
                type="file"
                onChange={(e) => setAvatarFile(e.target.files[0])}
              />
            </label>

            {user?.avatar && (
              <button
                onClick={deleteAvatar}
                className="mt-3 px-4 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg"
              >
                Remove Photo
              </button>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">{user?.fullName}</h1>
            <p className="text-gray-500">{user?.email}</p>

            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-sm">
              {user?.role}
            </span>

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1 text-gray-600">
                <span>Profile Completion</span>
                <span>{completion}%</span>
              </div>

              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            ["Total", stats?.total],
            ["Delivered", stats?.delivered],
            ["Pending", stats?.pending],
          ].map(([label, value]) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow">
              <p className="text-gray-500">{label}</p>
              <h2 className="text-3xl font-bold text-gray-800">{value}</h2>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Shipment Analytics
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={chartData} dataKey="value" outerRadius={90}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Edit Profile
            </h2>

            <div className="space-y-3">
              {Object.keys(form).map((field) => (
                <input
                  key={field}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  placeholder={field}
                  className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50"
                />
              ))}

              <button
                onClick={updateProfile}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Recent Shipments
          </h2>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentShipments?.length ? (
              recentShipments.map((s) => (
                <div
                  key={s._id}
                  className="p-4 rounded-2xl bg-gray-50 border"
                >
                  <p className="font-semibold text-gray-800">
                    {s.receiverName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {s.receiverAddress}
                  </p>
                  <span className="text-xs text-indigo-600">
                    {s.status}
                  </span>
                </div>
              ))
            ) : (
              <p>No shipments found</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;