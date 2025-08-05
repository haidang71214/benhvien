import { useState } from "react";
import AuthForm from "../../components/auth/AuthForm";
import { useAuth } from "../../context/AuthContext";
import { axiosInstance } from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  console.log(formData);
  
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post(`/auth/login`, formData);
      const data = response.data;
      console.log("Full API response:", response);
      console.log("Response data:", data);
      
      // Log the exact structure of the response
      console.log("Data user object:", data.user);
      console.log("Data role:", data.role);
      
      // Create user data object with the correct role and dob from API
      const userData = {
        id: data.user.id,
        userName: data.user.userName,
        email: data.user.email,
        avatarUrl: data.user.avatarUrl,
        role: data.role || data.user.role, // Try both possible locations for role
        dob: data.user.dob || null
      };
      
      console.log("Final user data being saved:", userData);
      login(userData, data.accessToken);
      // toast.success('Đăng nhập thành công !!!')
      
      console.log("User role:", userData.role);
      if (userData.role === 'admin') {
        console.log("Redirecting to admin page");
        navigate("/admin/dashboard");
      } else {
        console.log("Redirecting to home page");
        navigate("/");
      }
    } catch (err) {
  console.error("Login error:", err.response?.data || err.message);
  toast.error(err.response?.data?.message || 'Email hoặc mật khẩu không đúng. Vui lòng thử lại!');
}

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm
          mode="login"
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
