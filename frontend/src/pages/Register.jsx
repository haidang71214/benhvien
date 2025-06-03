import { useState, useEffect } from "react"; // Thêm useEffect
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom"; // Thêm useLocation
import { axiosInstance } from "../utils/axiosInstance";
import toast from "react-hot-toast";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation(); // Lấy query params từ URL

  const { email, password, confirmPassword, userName } = formData;

  // Xử lý redirect sau khi đăng nhập Google thành công
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const user = urlParams.get("user");

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        login(parsedUser, token);
        toast.success("Đăng nhập bằng Google thành công!");
        navigate("/"); // Redirect về trang chủ hoặc trang mong muốn
      } catch (err) {
        toast.error("Lỗi khi xử lý đăng nhập Google", err.message);
      }
    }
  }, [location, login, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/api/v1/auth/auth/google";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    if (!validateEmail(email)) {
      toast.error("Email không hợp lệ");
      return;
    }

    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (!userName.trim()) {
      toast.error("Tên người dùng không được để trống");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/auth/register", {
        email,
        password,
        userName,
      });

      login(data.user, data.token);
      toast.success("Đăng ký thành công!");
      navigate("/auth/verify-email", { state: { email } });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm
          mode="register"
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          onGoogleLogin={handleGoogleLogin}
        />
      </div>
    </div>
  );
}