import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  if (!email) {
    return <div className="text-center mt-10 text-red-500">Không có email để xác thực</div>;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await axios.post("http://localhost:8080/api/v1/auth/verifyEmail", {
        email,
        otpCode,
      });
      setSuccess(res.data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Xác thực thất bại");
    }
  };

  return (
    <form onSubmit={handleVerify} className="flex flex-col gap-4 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold">Xác Thực Email</h2>
      <p className="text-gray-600">Mã OTP đã được gửi đến: <strong>{email}</strong></p>
      <input
        type="text"
        value={otpCode}
        onChange={(e) => setOtpCode(e.target.value)}
        placeholder="Nhập mã OTP"
        required
        className="border p-2 rounded"
      />
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      <button type="submit" className="bg-primary text-white py-2 rounded">
        Xác Thực
      </button>
    </form>
  );
};

export default VerifyEmail;
