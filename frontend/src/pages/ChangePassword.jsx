<<<<<<< HEAD
<<<<<<< HEAD
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
=======
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
>>>>>>> fe-demo
=======
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
>>>>>>> fe-hung
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const ChangePassword = () => {
  const { accessToken } = useAuth();
<<<<<<< HEAD
<<<<<<< HEAD
  const navigate = useNavigate();

=======
>>>>>>> fe-demo
=======
>>>>>>> fe-hung
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
<<<<<<< HEAD
<<<<<<< HEAD
      return setMsg("New passwords do not match!");
=======
      return setMsg("Mật khẩu mới không khớp!");
>>>>>>> fe-demo
=======
      return setMsg("Mật khẩu mới không khớp!");
>>>>>>> fe-hung
    }

    if (!validatePassword(newPassword)) {
      return setMsg(
<<<<<<< HEAD
<<<<<<< HEAD
        "New password must be at least 8 characters long, include at least one special character and one uppercase letter."
=======
        "Mật khẩu mới phải có ít nhất 8 ký tự, 1 ký tự đặc biệt và 1 chữ cái in hoa."
>>>>>>> fe-demo
=======
        "Mật khẩu mới phải có ít nhất 8 ký tự, 1 ký tự đặc biệt và 1 chữ cái in hoa."
>>>>>>> fe-hung
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
<<<<<<< HEAD
<<<<<<< HEAD
      setMsg("Password changed successfully!");
=======
      setMsg("Đổi mật khẩu thành công!");
>>>>>>> fe-demo
=======
      setMsg("Đổi mật khẩu thành công!");
>>>>>>> fe-hung
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
<<<<<<< HEAD
<<<<<<< HEAD
      setMsg(err.response?.data?.message || "Error changing password");
=======
      setMsg(err.response?.data?.message || "Lỗi đổi mật khẩu");
>>>>>>> fe-demo
=======
      setMsg(err.response?.data?.message || "Lỗi đổi mật khẩu");
>>>>>>> fe-hung
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
<<<<<<< HEAD
<<<<<<< HEAD
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="text-blue-500 hover:underline mb-4 flex items-center"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Change Password
      </h2>

=======
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Đổi mật khẩu</h2>
>>>>>>> fe-demo
=======
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Đổi mật khẩu</h2>
>>>>>>> fe-hung
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <input
            type={showOld ? "text" : "password"}
<<<<<<< HEAD
<<<<<<< HEAD
            placeholder="Old Password"
=======
            placeholder="Mật khẩu cũ"
>>>>>>> fe-demo
=======
            placeholder="Mật khẩu cũ"
>>>>>>> fe-hung
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            required
<<<<<<< HEAD
<<<<<<< HEAD
            aria-label="Old Password"
=======
            aria-label="Mật khẩu cũ"
>>>>>>> fe-demo
=======
            aria-label="Mật khẩu cũ"
>>>>>>> fe-hung
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
<<<<<<< HEAD
<<<<<<< HEAD
            placeholder="New Password"
=======
            placeholder="Mật khẩu mới"
>>>>>>> fe-demo
=======
            placeholder="Mật khẩu mới"
>>>>>>> fe-hung
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            required
<<<<<<< HEAD
<<<<<<< HEAD
            aria-label="New Password"
=======
            aria-label="Mật khẩu mới"
>>>>>>> fe-demo
=======
            aria-label="Mật khẩu mới"
>>>>>>> fe-hung
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
<<<<<<< HEAD
<<<<<<< HEAD
            placeholder="Confirm New Password"
=======
            placeholder="Xác nhận mật khẩu mới"
>>>>>>> fe-demo
=======
            placeholder="Xác nhận mật khẩu mới"
>>>>>>> fe-hung
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            required
<<<<<<< HEAD
<<<<<<< HEAD
            aria-label="Confirm New Password"
=======
            aria-label="Xác nhận mật khẩu mới"
>>>>>>> fe-demo
=======
            aria-label="Xác nhận mật khẩu mới"
>>>>>>> fe-hung
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
<<<<<<< HEAD
<<<<<<< HEAD
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                ></path>
              </svg>
              Changing...
            </span>
          ) : (
            "Change Password"
=======
=======
>>>>>>> fe-hung
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
              </svg>
              Đang đổi...
            </span>
          ) : (
            "Đổi mật khẩu"
<<<<<<< HEAD
>>>>>>> fe-demo
=======
>>>>>>> fe-hung
          )}
        </button>

        {msg && (
          <div
            className={`text-center ${
<<<<<<< HEAD
<<<<<<< HEAD
              msg.includes("successfully") ? "text-green-500" : "text-red-500"
=======
              msg.includes("thành công") ? "text-green-500" : "text-red-500"
>>>>>>> fe-demo
=======
              msg.includes("thành công") ? "text-green-500" : "text-red-500"
>>>>>>> fe-hung
            }`}
          >
            {msg}
          </div>
        )}
      </form>
    </div>
  );
};

<<<<<<< HEAD
<<<<<<< HEAD
export default ChangePassword;
=======
export default ChangePassword;
>>>>>>> fe-demo
=======
export default ChangePassword;
>>>>>>> fe-hung
