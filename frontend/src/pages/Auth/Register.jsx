import { useState } from "react";
import AuthForm from "../../components/auth/AuthForm";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
    dob: "",
    sex: "other",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.userName || !formData.dob) {
      toast.error("Vui lòng điền đầy đủ thông tin.", { position: "top-right" });
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email không hợp lệ.", { position: "top-right" });
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.", { position: "top-right" });
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.", { position: "top-right" });
      setLoading(false);
      return;
    }

    if (new Date(formData.dob) > new Date()) {
      toast.error("Ngày sinh không hợp lệ.", { position: "top-right" });
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/register", {
        email: formData.email,
        password: formData.password,
        userName: formData.userName,
        dob: formData.dob,
        sex: formData.sex,
      });

      const data = response.data;
      login(data.user, data.token);
      toast.success("Đăng ký thành công!", { position: "top-right" });
      navigate("/auth/verify-email", { state: { email: formData.email } });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Có lỗi xảy ra. Vui lòng thử lại sau.";
      toast.error(message, { position: "top-right" });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center pt-24">
      <div className="w-full max-w-md">
        <AuthForm
          mode="register"
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}