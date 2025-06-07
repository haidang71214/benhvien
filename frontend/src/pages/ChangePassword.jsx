import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const ChangePassword = () => {
  const { accessToken } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const lengthOK = password.length >= 8;
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    return lengthOK && hasSpecial && hasUpper;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (newPassword !== confirmNewPassword) {
      return setMsg("Mật khẩu mới không khớp!");
    }

    if (!validatePassword(newPassword)) {
      return setMsg(
        "Mật khẩu mới phải có ít nhất 8 ký tự, 1 ký tự đặc biệt và 1 chữ cái in hoa."
      );
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:8080/api/v1/auth/updateMyself",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      setMsg("Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Lỗi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Đổi mật khẩu</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <input
            type={showOld ? "text" : "password"}
            placeholder="Mật khẩu cũ"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            required
            aria-label="Mật khẩu cũ"
          />
          <span
            onClick={() => setShowOld(!showOld)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-500"
          >
            {showOld ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </span>
        </div>

        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            required
            aria-label="Mật khẩu mới"
          />
          <span
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-500"
          >
            {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </span>
        </div>

        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Xác nhận mật khẩu mới"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            required
            aria-label="Xác nhận mật khẩu mới"
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-500"
          >
            {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
              </svg>
              Đang đổi...
            </span>
          ) : (
            "Đổi mật khẩu"
          )}
        </button>

        {msg && (
          <div
            className={`text-center ${
              msg.includes("thành công") ? "text-green-500" : "text-red-500"
            }`}
          >
            {msg}
          </div>
        )}
      </form>
    </div>
  );
};

export default ChangePassword;