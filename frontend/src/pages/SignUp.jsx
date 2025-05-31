import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ userName: "", email: "", password: "", age: "" });
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  try {
    const res = await axios.post("http://localhost:8080/api/v1/auth/register", form);
    const email = res.data.email;
    navigate("/verify-email", { state: { email } });
  } catch (err) {
    setError(err.response?.data?.message || "Signup failed");
  }
};

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold">Sign Up</h2>
      <input name="userName" placeholder="Username" value={form.userName} onChange={handleChange} required className="border p-2 rounded" />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="border p-2 rounded" />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="border p-2 rounded" />
      <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} className="border p-2 rounded" />
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" className="bg-primary text-white py-2 rounded">Sign Up</button>
    </form>
  );
};

export default Signup;