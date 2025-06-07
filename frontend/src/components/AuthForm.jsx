import { useEffect, useState } from "react";
import { LogIn, UserPlus, LoaderCircle, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { GoogleIcon } from "@/components/google-icon";
import { Link } from "react-router-dom";

export default function AuthForm({
  className = "",
  formData,
  onChange,
  onSubmit,
  loading,
  error,
  onGoogleLogin,
  mode = "login",
}) {
  const isLogin = mode === "login";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const config = {
    login: {
      title: "Welcome Back!",
      submitText: "Login",
      submitIcon: LogIn,
      loadingText: "Logging in...",
      alternateText: "Don't have an account?",
      alternateLink: "/auth/register",
      alternateLinkText: "Sign up",
      googleText: "Login with Google",
    },
    register: {
      title: "Create Account",
      submitText: "Sign Up",
      submitIcon: UserPlus,
      loadingText: "Creating account...",
      alternateText: "Already have an account?",
      alternateLink: "/auth/login",
      alternateLinkText: "Sign in",
      googleText: "Sign up with Google",
    },
  };

  const currentConfig = config[mode];

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className={`flex justify-center mt-24 px-4 ${className}`}>
      <div className="w-full max-w-md bg-white shadow-xl border rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {currentConfig.title}
        </h2>
        <form onSubmit={onSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label htmlFor="userName" className="block mb-1 font-medium">
                Username
              </label>
              <input
                type="text"
                name="userName"
                placeholder="Your username"
                required
                value={formData.userName || ""}
                onChange={onChange}
                disabled={loading}
                className={`w-full h-10 px-3 bg-gray-100 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  error ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={onChange}
              disabled={loading}
              className={`w-full h-10 px-3 bg-gray-100 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                error ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
          </div>

          <div className="relative">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block mb-1 font-medium">
                Password
              </label>
              {isLogin && (
                <Link
                  to="/auth/forgot-password"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={onChange}
              disabled={loading}
              className={`w-full h-10 px-3 bg-gray-100 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                error ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform text-gray-500"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {!isLogin && (
            <div>
              <label className="block mb-1 font-medium">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword || ""}
                onChange={onChange}
                disabled={loading}
                className={`w-full h-10 px-3 bg-gray-100 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  error ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
                  {currentConfig.loadingText}
                </>
              ) : (
                <>
                  <currentConfig.submitIcon className="w-4 h-4 mr-2" />
                  {currentConfig.submitText}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onGoogleLogin}
              className="w-full h-11 border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 rounded-md flex justify-center items-center gap-2"
            >
              <GoogleIcon className="w-5 h-5" />
              {currentConfig.googleText}
            </button>
          </div>

          <div className="text-center pt-4 text-sm text-gray-600">
            {currentConfig.alternateText}{" "}
            <Link
              to={currentConfig.alternateLink}
              className="text-blue-600 hover:underline font-medium"
            >
              {currentConfig.alternateLinkText}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
