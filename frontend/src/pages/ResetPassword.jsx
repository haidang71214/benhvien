import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token: resetToken } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/api/v1/auth/resetPassword", {
        resetToken,
        newPassword,
      });
      toast.success(
        "Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập..."
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  if (!resetToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-red-600 font-semibold">
          Link không hợp lệ.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
