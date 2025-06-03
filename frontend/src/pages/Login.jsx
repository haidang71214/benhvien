import { useState } from "react";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/context/AuthContext";
import { axiosInstance } from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
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
      const response = await axiosInstance.post("/auth/login", formData);
      const data = response.data;
      login(data.user, data.accessToken);
      toast.success('Đăng nhập thành công !!!')
      navigate("/");
    } catch (err) {
      toast.error(err.response.data.message || 'Đăng nhập thất bại !!!');
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
