import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
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
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Đổi mật khẩu</h1>
      <p className="text-slate-600 mb-8">Cập nhật mật khẩu để bảo mật tài khoản của bạn.</p>
      
      <div className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-2">Mật khẩu cũ</label>
              <div className="relative">
                <input
                  type={showOld ? "text" : "password"}
                  placeholder="Nhập mật khẩu cũ"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-blue-500 transition-colors"
                >
                  {showOld ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-2">Mật khẩu mới</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-blue-500 transition-colors"
                >
                  {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-2">Xác nhận mật khẩu mới</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-blue-500 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Yêu cầu mật khẩu:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Ít nhất 8 ký tự</li>
              <li>• Có ít nhất 1 ký tự đặc biệt</li>
              <li>• Có ít nhất 1 chữ cái in hoa</li>
            </ul>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
                </svg>
                Đang cập nhật...
              </span>
            ) : (
              "Cập nhật mật khẩu"
            )}
          </button>

          {msg && (
            <div
              className={`p-4 rounded-xl text-center font-medium ${
                msg.includes("thành công") 
                  ? "bg-green-50 text-green-700 border border-green-200" 
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {msg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;