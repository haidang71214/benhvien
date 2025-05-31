import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const { user, setUser, accessToken } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userName: user?.userName || "",
    age: user?.age || "",
    password: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.image || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setForm({
      userName: user?.userName || "",
      age: user?.age || "",
      password: "",
    });
    setPreview(user?.image || user?.avatarUrl || "");
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const formData = new FormData();
      formData.append("userName", form.userName);
      formData.append("age", form.age);
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
      setMsg("Cập nhật thành công!");
      setUser(res.data.user);
      setPreview(
        res.data.user.image || res.data.user.avatarUrl || "/default-avatar.png"
      );
      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      storedUser.image = res.data.user.image || res.data.user.avatarUrl;
      localStorage.setItem("user", JSON.stringify(storedUser));
    } catch (err) {
      setMsg(err.response?.data?.message || "Lỗi cập nhật");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Thông tin cá nhân</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col items-center">
          <img
            src={preview || "/default-avatar.png"}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover mb-2"
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <label>
          Tên người dùng:
          <input
            type="text"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
        </label>
        <label>
          Tuổi:
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </button>
        {msg && <div className="text-center text-red-500">{msg}</div>}
      </form>
            <button
          type="button"
          className="text-blue-500 underline mt-2"
          onClick={() => navigate("/change-password")}
        >
          Đổi mật khẩu
        </button>
    </div>
  );
};

export default MyProfile;
