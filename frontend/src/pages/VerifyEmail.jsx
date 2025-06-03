import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const VerifyEmail = () => {
  const [otpCode, setOtpCode] = useState("");
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

    if (otpCode.length !== 6) {
      toast.error("Vui lòng nhập đầy đủ mã OTP 6 chữ số");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/verifyEmail",
        {
          email,
          otpCode,
        }
      );

      toast.success(res.data.message || "Xác thực thành công!");
      setTimeout(() => navigate("/auth/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Xác thực thất bại");
    }
  };

  return (
    <form onSubmit={handleVerify} className="flex flex-col gap-6 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-center">Xác Thực Email</h2>
      <p className="text-gray-600 text-center">
        Mã OTP đã được gửi đến: <strong>{email}</strong>
      </p>

      <div className="flex justify-center">
        <InputOTP 
          maxLength={6} 
          value={otpCode} 
          onChange={(value) => setOtpCode(value)}
        >
          <InputOTPGroup className="gap-4">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={otpCode.length !== 6}
      >
        Xác Thực
      </button>
    </form>
  );
};

export default VerifyEmail;