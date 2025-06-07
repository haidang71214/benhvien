import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
<<<<<<< HEAD
=======
import toast from "react-hot-toast";
>>>>>>> fe-demo

const ResetPassword = () => {
  const { token: resetToken } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
<<<<<<< HEAD
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
=======

  const handleSubmit = async (e) => {
    e.preventDefault();

>>>>>>> fe-demo
    try {
      await axios.post("http://localhost:8080/api/v1/auth/resetPassword", {
        resetToken,
        newPassword,
      });
<<<<<<< HEAD
      setMsg("Đặt lại mật khẩu thành công! Đăng nhập lại.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
=======
      toast.success(
        "Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập..."
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
>>>>>>> fe-demo
    }
  };

  if (!resetToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
<<<<<<< HEAD
        <div className="bg-white p-8 rounded shadow">Link không hợp lệ.</div>
=======
        <div className="bg-white p-8 rounded shadow text-red-600 font-semibold">
          Link không hợp lệ.
        </div>
>>>>>>> fe-demo
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
<<<<<<< HEAD
        <h2 className="text-2xl font-semibold mb-6 text-center">Reset Password</h2>
        {msg && <div className="mb-4 text-green-600 bg-green-100 p-2 rounded">{msg}</div>}
        {error && <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">{error}</div>}
=======
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Reset Password
        </h2>
>>>>>>> fe-demo
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
<<<<<<< HEAD
              onChange={e => setNewPassword(e.target.value)}
=======
              onChange={(e) => setNewPassword(e.target.value)}
>>>>>>> fe-demo
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

<<<<<<< HEAD
export default ResetPassword;
=======
export default ResetPassword;
>>>>>>> fe-demo
