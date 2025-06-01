import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) =>
    /^(?=.*[A-Z])(?=.*\W).{8,}$/.test(password);

  const validateForm = () => {
    const newErrors = {};
    if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!validatePassword(form.password)) {
      newErrors.password =
        "Password must be at least 8 characters, include a capital letter and a special character.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/api/v1/auth/auth/google";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        form,
        { withCredentials: true }
      );
      login(res.data.user, res.data.accessToken);
      navigate("/");
    } catch (err) {
      setApiError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-200 rounded-full opacity-30 z-0"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-200 rounded-full opacity-30 z-0"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Welcome Back <span role="img" aria-label="wave">👋</span>
          </h2>

          {apiError && (
            <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-md text-sm text-center animate-shake">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                autoComplete="username"
                disabled={loading}
                className={`w-full border rounded-lg px-4 py-2 transition focus:outline-none focus:ring-2 ${
                  errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  className={`w-full border rounded-lg px-4 py-2 pr-10 transition focus:outline-none focus:ring-2 ${
                    errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className={`w-full mt-4 bg-blue-600 text-black py-2.5 rounded-lg font-medium hover:bg-blue-700 transition duration-200 flex items-center justify-center ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              )}
              Login
            </button>
          </form>

          <div className="my-6 mt-4 flex items-center justify-between">
            <div className="border-t border-gray-300 w-full"></div>
            <span className="px-3 text-sm text-gray-500">or</span>
            <div className="border-t border-gray-300 w-full"></div>
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-lg px-4 py-2 border border-gray-300 hover:bg-gray-50 cursor-pointer transition font-medium text-gray-700 bg-white"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <img
              className="h-4 w-4"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
              alt="Google Logo"
            />
            Continue with Google
          </button>

          <div className="mt-6 flex flex-col gap-2 text-center text-sm text-gray-600">
            <span>
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-blue-600 hover:underline cursor-pointer font-medium"
              >
                Sign Up
              </span>
            </span>
            <span>
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-blue-600 hover:underline cursor-pointer font-medium"
              >
                Forgot Password?
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Shake animation */}
      <style>
        {`
          .animate-shake {
            animation: shake 0.3s;
          }
          @keyframes shake {
            0% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-8px); }
            80% { transform: translateX(8px); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
};

export default Login;
