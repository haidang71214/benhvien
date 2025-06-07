<<<<<<< HEAD
import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";

const VerifyEmail = () => {
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
=======
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LoaderCircle } from "lucide-react";

const VERIFY_EMAIL_API = "http://localhost:8080/api/v1/auth/verifyEmail";
const RESEND_OTP_API = "http://localhost:8080/api/v1/auth/resendOTP";
const OTP_LENGTH = 6;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const VerifyEmail = () => {
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

>>>>>>> fe-demo
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

<<<<<<< HEAD
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
=======
  useEffect(() => {
    if (!email) {
      toast.error("Không có email để xác thực");
      navigate("/auth/register");
    }
  }, [email, navigate]);

  const handleVerify = useCallback(
    async (e) => {
      e.preventDefault();

      if (otpCode.length !== OTP_LENGTH) {
        toast.error(`Vui lòng nhập đầy đủ mã OTP ${OTP_LENGTH} chữ số`);
        return;
      }

      setLoading(true);

      try {
        const { data } = await axios.post(VERIFY_EMAIL_API, { email, otpCode });
        await delay(2000);
        toast.success(data.message || "Xác thực thành công!");
        navigate("/auth/login");
      } catch (err) {
        const message =
          err.response?.data?.message || "Xác thực thất bại. Vui lòng thử lại";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [email, otpCode, navigate]
  );

  const resendOTP = async () => {
    if (!email) {
      toast.error("Không có email để gửi lại mã OTP");
      return;
    }

    setResending(true);
    try {
      const response = await fetch(RESEND_OTP_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success("Mã OTP mới đã được gửi!");
      } else {
        throw new Error("Không thể gửi lại mã OTP");
      }
    } catch (error) {
      toast.error(
        "Không thể gửi lại mã OTP. Vui lòng thử lại.",
        error.response?.data?.message || error.message
      );
    } finally {
      setResending(false);
>>>>>>> fe-demo
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <form
      onSubmit={handleVerify}
      className="flex flex-col gap-6 max-w-md mx-auto mt-10"
      noValidate
    >
      <h2 className="text-2xl font-semibold text-center">Xác Thực Email</h2>
      <p className="text-gray-600 text-center">
        Mã OTP đã được gửi đến: <strong>{email}</strong>
      </p>

      <div className="flex justify-center">
        <InputOTP maxLength={OTP_LENGTH} value={otpCode} onChange={setOtpCode}>
          <InputOTPGroup className="gap-4">
            {[...Array(OTP_LENGTH)].map((_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={otpCode.length !== OTP_LENGTH || loading}
      >
        {loading ? (
          <LoaderCircle className="animate-spin mx-auto" />
        ) : (
          "Xác Thực"
        )}
      </button>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm mb-2">Không nhận được mã?</p>
        <button
          type="button"
          onClick={resendOTP}
          disabled={resending}
          className="text-blue-500 hover:text-blue-600 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {resending ? "Đang gửi lại..." : "Gửi lại mã OTP"}
        </button>
      </div>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Quay lại
        </button>
      </div>
    </form>
  );
};

export default VerifyEmail;
>>>>>>> fe-demo
