import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";

const VerifyEmail = () => {
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  if (!email) {
    return (
      <div className="text-center mt-10 text-red-500">
        Không có email để xác thực
      </div>
    );
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Retrieve OTP and user data from sessionStorage
    const storedOtp = sessionStorage.getItem("otpCode");
    const otpExpires = sessionStorage.getItem("otpExpires");
    const userData = JSON.parse(sessionStorage.getItem("signupData"));

    if (!storedOtp || !otpExpires || !userData) {
      setError("Dữ liệu xác thực không hợp lệ. Vui lòng đăng ký lại.");
      toast.error("Dữ liệu xác thực không hợp lệ. Vui lòng đăng ký lại.");
      return;
    }

    // Check if OTP is valid and not expired
    if (otpCode !== storedOtp) {
      setError("Mã OTP không đúng");
      toast.error("Mã OTP không đúng");
      return;
    }

    if (new Date() > new Date(otpExpires)) {
      setError("Mã OTP đã hết hạn");
      toast.error("Mã OTP đã hết hạn");
      sessionStorage.clear();
      return;
    }

    // Create user by calling register endpoint
    try {
      const res = await axios.post("http://localhost:8080/api/v1/auth/register", userData);
      setSuccess(res.data.message);
      // Clear sessionStorage
      sessionStorage.removeItem("signupData");
      sessionStorage.removeItem("otpCode");
      sessionStorage.removeItem("otpExpires");
      toast.success("Email verified and account created successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Tạo tài khoản thất bại");
      toast.error(err.response?.data?.message || "Tạo tài khoản thất bại");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleVerify}
        className="flex flex-col gap-4 max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-center">Xác Thực Email</h2>
        <p className="text-gray-600 text-center">
          Mã OTP đã được gửi đến: <strong>{email}</strong>
        </p>
        <input
          type="text"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
          placeholder="Nhập mã OTP"
          required
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {error && <div className="text-red-500 text-center">{error}</div>}
        {success && <div className="text-green-500 text-center">{success}</div>}
        <button
          type="submit"
          className="bg-indigo-600 text-black py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          Xác Thực
        </button>
      </motion.form>
    </div>
  );
};

export default VerifyEmail;