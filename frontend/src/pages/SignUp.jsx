import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ userName: "", email: "", password: "", age: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Weak",
    requirements: [],
  });
  const navigate = useNavigate();

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let score = 0;
    const requirements = [];

    // Length checks
    if (password.length >= 16) score += 30;
    else if (password.length >= 12) score += 20;
    else if (password.length >= 8) score += 10;
    else requirements.push("At least 8 characters");

    // Character type checks
    if (/[A-Z]/.test(password)) score += 20;
    else requirements.push("One uppercase letter");

    if (/[a-z]/.test(password)) score += 20;
    else requirements.push("One lowercase letter");

    if (/[0-9]/.test(password)) score += 20;
    else requirements.push("One number");

    if (/[!@#$%^&*]/.test(password)) score += 10;
    else requirements.push("One special character");

    // Determine label based on score
    let label = "Weak";
    if (score >= 80) label = "Strong";
    else if (score >= 50) label = "Medium";

    return { score, label, requirements };
  };

  // Update password strength on input change
  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(form.password));
  }, [form.password]);

  const validateForm = () => {
    const newErrors = {};

    if (!form.userName) {
      newErrors.userName = "Username is required";
    } else if (/\d/.test(form.userName)) {
      newErrors.userName = "Username cannot contain numbers";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(form.password)) {
      newErrors.password =
        "Password must be at least 8 characters long and include one capital letter and one special character";
    }

    if (!form.age) {
      newErrors.age = "Age is required";
    } else if (!/^\d+$/.test(form.age)) {
      newErrors.age = "Age must be a number";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the form errors", { id: "form-error" });
      return;
    }

    setIsLoading(true);
    try {
      const otpCode = uuidv4().slice(0, 6).toUpperCase();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      sessionStorage.setItem("signupData", JSON.stringify(form));
      sessionStorage.setItem("otpCode", otpCode);
      sessionStorage.setItem("otpExpires", otpExpires);

      await axios.post("http://localhost:8080/api/v1/auth/sendOtpEmail", {
        email: form.email,
        userName: form.userName,
        otpCode,
      });

      toast.success("OTP sent to your email. Please verify.", { id: "otp-success" });
      navigate("/verify-email", { state: { email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP", { id: "otp-error" });
      setErrors({ submit: err.response?.data?.message || "Failed to send OTP" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "8px",
            padding: "12px",
          },
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl"
        role="region"
        aria-labelledby="signup-heading"
      >
        <div className="text-center">
          <h2 id="signup-heading" className="text-3xl font-bold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Join us today! Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Log in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
          {Object.keys(errors).length > 0 && errors.submit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 p-3 rounded-md text-sm text-red-700"
              role="alert"
            >
              {errors.submit}
            </motion.div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                placeholder="Enter your username"
                value={form.userName}
                onChange={handleChange}
                required
                aria-describedby={errors.userName ? "userName-error" : undefined}
                className={`mt-1 block w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                  transition-all duration-200
                  ${errors.userName ? "border-red-500" : "border-gray-300"}`}
              />
              <AnimatePresence>
                {errors.userName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    id="userName-error"
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.userName}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`mt-1 block w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                  transition-all duration-200
                  ${errors.email ? "border-red-500" : "border-gray-300"}`}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    id="email-error"
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  aria-describedby={
                    errors.password
                      ? "password-error password-strength"
                      : "password-strength"
                  }
                  className={`mt-1 block w-full px-4 py-3 pr-12 border rounded-lg text-gray-900 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                    transition-all duration-200
                    ${errors.password ? "border-red-500" : "border-gray-300"}`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-4 items-center pr-4  text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              </div>
              <div className="mt-3">
                {/* Segmented Progress Bar */}
                <div className="flex h-2 w-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300
                      ${passwordStrength.score >= 20 ? "bg-red-500" : "bg-gray-200"}`}
                    style={{ width: "33.33%" }}
                  />
                  <div
                    className={`h-full transition-all duration-300
                      ${passwordStrength.score >= 50 ? "bg-yellow-500" : "bg-gray-200"}`}
                    style={{ width: "33.33%" }}
                  />
                  <div
                    className={`h-full transition-all duration-300
                      ${passwordStrength.score >= 80 ? "bg-green-500" : "bg-gray-200"}`}
                    style={{ width: "33.33%" }}
                  />
                </div>
                <p
                  id="password-strength"
                  className="mt-2 text-sm text-gray-600"
                  aria-live="polite"
                >
                  Password strength: <span className="capitalize font-medium">{passwordStrength.label}</span>
                </p>
                {/* Requirements List */}
                <AnimatePresence>
                  {form.password && passwordStrength.requirements.length > 0 && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-3 text-sm text-gray-600 list-disc list-inside"
                    >
                      {passwordStrength.requirements.map((req, index) => (
                        <li key={index} className="text-red-600">
                          {req}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    id="password-error"
                    className="mt-3 text-sm text-red-600"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                id="age"
                name="age"
                type="text"
                placeholder="Enter your age"
                value={form.age}
                onChange={handleChange}
                required
                aria-describedby={errors.age ? "age-error" : undefined}
                className={`mt-1 block w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                  transition-all duration-200
                  ${errors.age ? "border-red-500" : "border-gray-300"}`}
              />
              <AnimatePresence>
                {errors.age && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    id="age-error"
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.age}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg
              text-sm font-semibold text-black bg-indigo-600 hover:bg-indigo-700 focus:outline-none
              focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400
              disabled:cursor-not-allowed transition-all duration-200`}
            aria-label={isLoading ? "Submitting..." : "Sign Up"}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : null}
            {isLoading ? "Sending OTP..." : "Sign Up"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;