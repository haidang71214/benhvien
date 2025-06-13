import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const MyProfile = () => {
  const { user, setUser, accessToken } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userName: user?.userName || "",
    dob: user?.dob || "",
    sex: user?.sex || "other",
    password: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.image || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      userName: user?.userName || "",
      dob: user?.dob || "",
      sex: user?.sex || "other",
      password: "",
    });
    setPreview(user?.image || user?.avatarUrl || "/default-avatar.png");
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("userName", form.userName);
      formData.append("dob", form.dob);
      formData.append("sex", form.sex);
      if (form.password) formData.append("password", form.password);
      if (image) formData.append("img", image);

      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/updateMyself",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Profile updated successfully!");
      setUser(res.data.user);
      setPreview(
        res.data.user.image || res.data.user.avatarUrl || "/default-avatar.png"
      );

      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      storedUser.image = res.data.user.image || res.data.user.avatarUrl;
      localStorage.setItem("user", JSON.stringify(storedUser));
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Update failed. Please try again."
      );
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-40 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        My Profile
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <img
            src={preview || "/default-avatar.png"}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover mb-3 border"
          />
          <label className="cursor-pointer bg-blue-50 text-blue-700 px-4 py-2 rounded-md border border-blue-300 hover:bg-blue-100 transition">
            Change Avatar
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
          <select
            name="sex"
            value={form.sex}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="other">Other</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-lg text-black font-medium ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } transition`}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <div className="text-center mt-6">
        <button
          type="button"
          className="text-blue-600 hover:underline text-sm"
          onClick={() => navigate("/change-password")}
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default MyProfile;