import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance";

const PasswordInput = ({
  label,
  value,
  onChange,
  show,
  toggleShow,
  placeholder,
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 pr-12 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 transition-all duration-200"
        required
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-blue-500"
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  </div>
);

const ChangePassword = () => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [show, setShow] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) =>
    password.length >= 8 &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password) &&
    /[A-Z]/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmNewPassword } = form;

    if (newPassword !== confirmNewPassword)
      return toast.error("Mật khẩu mới không khớp!");

    if (!validatePassword(newPassword))
      return toast.error(
        "Mật khẩu phải có ít nhất 8 ký tự, có ký tự đặc biệt & chữ in hoa."
      );

    try {
      setLoading(true);
      await axiosInstance.post(
        "/auth/updateMyself",
        { oldPassword, newPassword },
      );
      toast.success("Đổi mật khẩu thành công!");
      setForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Đổi mật khẩu</h1>
      <p className="text-slate-600 mb-8">
        Cập nhật mật khẩu để bảo mật tài khoản của bạn.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        <div className="space-y-4">
          <PasswordInput
            label="Mật khẩu cũ"
            value={form.oldPassword}
            onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
            show={show.old}
            toggleShow={() => setShow({ ...show, old: !show.old })}
            placeholder="Nhập mật khẩu cũ"
          />
          <PasswordInput
            label="Mật khẩu mới"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            show={show.new}
            toggleShow={() => setShow({ ...show, new: !show.new })}
            placeholder="Nhập mật khẩu mới"
          />
          <PasswordInput
            label="Xác nhận mật khẩu mới"
            value={form.confirmNewPassword}
            onChange={(e) =>
              setForm({ ...form, confirmNewPassword: e.target.value })
            }
            show={show.confirm}
            toggleShow={() => setShow({ ...show, confirm: !show.confirm })}
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
          <h4 className="font-medium text-blue-800 mb-2">Yêu cầu mật khẩu:</h4>
          <ul className="space-y-1 list-disc list-inside">
            <li
              className={form.newPassword.length >= 8 ? "text-green-600" : ""}
            >
              {form.newPassword.length >= 8 ? "✔️" : "❌"} Ít nhất 8 ký tự
            </li>
            <li
              className={
                /[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword)
                  ? "text-green-600"
                  : ""
              }
            >
              {/[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword) ? "✔️" : "❌"} Có
              ít nhất 1 ký tự đặc biệt
            </li>
            <li
              className={/[A-Z]/.test(form.newPassword) ? "text-green-600" : ""}
            >
              {/[A-Z]/.test(form.newPassword) ? "✔️" : "❌"} Có ít nhất 1 chữ
              cái in hoa
            </li>
          </ul>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition font-medium"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-25"
                />
                <path
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  fill="currentColor"
                  className="opacity-75"
                />
              </svg>
              Đang cập nhật...
            </span>
          ) : (
            "Cập nhật mật khẩu"
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;