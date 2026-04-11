import { useEffect, useState } from "react";
import API from "../api/axios";

const Profile = () => {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  const [form, setForm] = useState({ fullName: "", email: "" });
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/user/me");
      setData(res.data);

      setForm({
        fullName: res.data.user.fullName,
        email: res.data.user.email,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const updateProfile = async () => {
    await API.put("/user/update", form);
    alert("Profile updated");
    fetchProfile();
  };

  const changePassword = async () => {
    await API.put("/user/change-password", passwords);
    alert("Password changed");
    setPasswords({ oldPassword: "", newPassword: "" });
  };

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center text-indigo-600 animate-pulse">
        Loading Profile...
      </div>
    );
  }

  const { user, stats, recentShipments } = data;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <div className="relative h-48 bg-gradient-to-r from-indigo-600 to-indigo-800">

        {/* AVATAR + INFO */}
        <div className="absolute -bottom-12 left-8 flex items-end gap-4">

          {/* AVATAR (IMAGE + FALLBACK FIXED) */}
          <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg overflow-hidden flex items-center justify-center">

            {user.avatar ? (
              <img
                src={user.avatar}
                alt="profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white text-3xl font-bold">
                {user.fullName?.charAt(0).toUpperCase()}
              </div>
            )}

          </div>

          {/* NAME */}
          <div className="text-white mb-2">
            <h2 className="text-2xl font-bold">{user.fullName}</h2>
            <p className="text-sm opacity-90">{user.email}</p>
          </div>

        </div>
      </div>

      {/* CONTENT */}
      <div className="pt-16 px-6">

        {/* ROLE */}
        <div className="inline-flex items-center gap-2 bg-white shadow-sm border px-3 py-1 rounded-full text-sm text-gray-700">
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          Role: <span className="font-semibold text-indigo-600">{user.role}</span>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">

          <div className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-gray-500">Total Shipments</p>
            <h2 className="text-3xl font-bold text-gray-800">{stats.total}</h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border-l-4 border-emerald-500 p-5">
            <p className="text-gray-500">Delivered</p>
            <h2 className="text-3xl font-bold text-emerald-600">
              {stats.delivered}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border-l-4 border-amber-400 p-5">
            <p className="text-gray-500">Pending</p>
            <h2 className="text-3xl font-bold text-amber-500">
              {stats.pending}
            </h2>
          </div>

        </div>

        {/* TABS */}
        <div className="flex gap-6 mt-8 border-b">
          {["profile", "security", "shipments"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 capitalize transition ${
                activeTab === tab
                  ? "border-b-2 border-indigo-600 text-indigo-600 font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="bg-white shadow-sm border rounded-xl p-6">
              <h3 className="font-bold mb-4">Edit Profile</h3>

              <input
                className="w-full border p-2 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-400"
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
                placeholder="Full Name"
              />

              <input
                className="w-full border p-2 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-400"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="Email"
              />

              <button
                onClick={updateProfile}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Update Profile
              </button>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === "security" && (
            <div className="bg-white shadow-sm border rounded-xl p-6">
              <h3 className="font-bold mb-4">Change Password</h3>

              <input
                type="password"
                className="w-full border p-2 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-400"
                placeholder="Old Password"
                value={passwords.oldPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, oldPassword: e.target.value })
                }
              />

              <input
                type="password"
                className="w-full border p-2 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-400"
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
              />

              <button
                onClick={changePassword}
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              >
                Change Password
              </button>
            </div>
          )}

          {/* SHIPMENTS */}
          {activeTab === "shipments" && (
            <div className="lg:col-span-2 bg-white shadow-sm border rounded-xl p-6">
              <h3 className="font-bold mb-4">Recent Shipments</h3>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentShipments?.length ? (
                  recentShipments.map((s) => (
                    <div
                      key={s._id}
                      className="p-3 border rounded-lg hover:shadow-sm transition bg-white"
                    >
                      <p className="font-medium">
                        {s.receiverName} → {s.receiverAddress}
                      </p>
                      <p className="text-xs text-gray-500">
                        Status:{" "}
                        <span className="text-indigo-600 font-semibold">
                          {s.status}
                        </span>
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No shipments found</p>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;