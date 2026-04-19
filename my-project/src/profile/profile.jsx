import { useEffect, useState } from "react";
import API from "../api/axios";

const Profile = () => {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const BASE_URL = "http://localhost:5000";

  const getImageUrl = (avatar) => {
    if (!avatar) return "/default.png";
    return `${BASE_URL}/${avatar.replace(/\\/g, "/")}`;
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================= PROFILE =================
  const fetchProfile = async () => {
    try {
      const res = await API.get("/user/me", {
        withCredentials: true,
      });

      setData(res.data);

      setForm({
        fullName: res.data?.user?.fullName || "",
        email: res.data?.user?.email || "",
      });

    } catch (err) {
      console.log(err);
    }
  };

  // ================= UPDATE =================
  const updateProfile = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("email", form.email);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await API.put("/user/update", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAvatarFile(null);
      await fetchProfile();

      console.log("✅ Profile Updated");

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= PASSWORD FIXED =================
  const changePassword = async () => {
    try {
      if (!passwords.oldPassword || !passwords.newPassword) {
        alert("Please fill all fields");
        return;
      }

      if (passwords.newPassword.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      await API.put("/user/change-password", passwords, {
        withCredentials: true,
      });

      alert("Password updated successfully");

      setPasswords({
        oldPassword: "",
        newPassword: "",
      });

    } catch (err) {
      console.log(err);
      alert("Password change failed");
    }
  };

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-indigo-600 font-semibold animate-pulse">
          Loading Profile...
        </div>
      </div>
    );
  }

  const { user, stats, recentShipments } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

      {/* HERO */}
      <div className="relative h-72 bg-gray-900">

        <label className="absolute inset-0 cursor-pointer">
          <input
            type="file"
            hidden
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />

          <img
            src={`${getImageUrl(user?.avatar)}?t=${Date.now()}`}
            className="w-full h-full object-cover opacity-70"
          />
        </label>

        {/* PROFILE CARD */}
        <div className="absolute bottom-[-40px] left-10 flex items-center gap-4 bg-white shadow-xl rounded-2xl p-4">

          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-indigo-500">
            <img
              src={`${getImageUrl(user?.avatar)}?t=${Date.now()}`}
              className="w-full h-full object-cover opacity-70 border-2"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold">{user?.fullName}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
              {user?.role}
            </span>
          </div>

        </div>
      </div>

      {/* CONTENT */}
      <div className="pt-20 px-6">

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          <div className="bg-white p-4 rounded-xl shadow hover:scale-105 transition">
            <p>Total</p>
            <h2 className="text-xl font-bold">{stats?.total}</h2>
          </div>

          <div className="bg-green-100 p-4 rounded-xl shadow">
            <p>Delivered</p>
            <h2 className="text-xl font-bold text-green-600">
              {stats?.delivered}
            </h2>
          </div>

          <div className="bg-yellow-100 p-4 rounded-xl shadow">
            <p>Pending</p>
            <h2 className="text-xl font-bold text-yellow-600">
              {stats?.pending}
            </h2>
          </div>

        </div>

        {/* TABS */}
        <div className="flex gap-6 border-b mb-4">
          {["profile", "security", "shipments"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`pb-2 capitalize font-medium ${
                activeTab === t
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="bg-white p-5 rounded-xl shadow">

            <input
              className="w-full border p-2 rounded mb-3"
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
              placeholder="Full Name"
            />

            <input
              className="w-full border p-2 rounded mb-3"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="Email"
            />

            <button
              onClick={updateProfile}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>

          </div>
        )}

        {/* SECURITY TAB FIXED */}
        {activeTab === "security" && (
          <div className="bg-white p-5 rounded-xl shadow">

            <h2 className="font-bold mb-4">Change Password</h2>

            <input
              type="password"
              className="w-full border p-2 rounded mb-3"
              placeholder="Old Password"
              value={passwords.oldPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, oldPassword: e.target.value })
              }
            />

            <input
              type="password"
              className="w-full border p-2 rounded mb-3"
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
            />

            <button
              onClick={changePassword}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Update Password
            </button>

          </div>
        )}

        {/* SHIPMENTS */}
        {activeTab === "shipments" && (
          <div className="bg-white p-5 rounded-xl shadow max-h-96 overflow-y-auto">

            {recentShipments?.length ? (
              recentShipments.map((s) => (
                <div
                  key={s._id}
                  className="border p-3 rounded mb-2 hover:bg-gray-50"
                >
                  <p className="font-medium">
                    {s.receiverName} → {s.receiverAddress}
                  </p>
                  <p className="text-xs text-gray-500">
                    {s.status}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No shipments found</p>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;