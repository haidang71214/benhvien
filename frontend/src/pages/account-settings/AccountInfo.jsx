import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { User, Loader2 } from "lucide-react";
import { axiosInstance } from "../../utils/axiosInstance";
import AvatarUpload from "../../components/Auth/AvatarUpload";

const AccountInfo = () => {
  const { user, setUser, accessToken } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.userName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    location: user?.location || "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.image || user?.avatarUrl || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      fullName: user?.fullName || user?.userName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
      location: user?.location || "",
    });
    setPreview(user?.image || user?.avatarUrl || "");
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("location", formData.location);

      if (image) {
        formDataToSend.append("img", image);
      }

      const res = await axiosInstance.post(
        "/api/v1/auth/updateMyself",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Cập nhật thông tin thành công!");
      setUser(res.data.user);
      setPreview(res.data.user.image || res.data.user.avatarUrl || "");

      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      Object.assign(storedUser, res.data.user);
      localStorage.setItem("user", JSON.stringify(storedUser));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    const resetData = {
      userName: "",
      email: "",
      bio: "",
    };
    try {
      const res = await axiosInstance.post(
        "/api/v1/auth/updateMyself",
        resetData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Đặt lại thông tin thành công !!!");

      setFormData((prev) => ({
        ...prev,
        fullName: "",
        email: "",
        bio: "",
      }));
      setImage(null);
      setPreview("");

      setUser((prev) => ({
        ...prev,
        userName: "",
        email: "",
        bio: "",
      }));

      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      storedUser.userName = "";
      storedUser.email = "";
      storedUser.bio = "";
      localStorage.setItem("user", JSON.stringify(storedUser));
    } catch (error) {
      toast.error("Lỗi khi đặt lại thông tin.");
      console.log("Lỗi khi đặt lại thông tin", error.message);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            Thông tin tài khoản
          </h1>
          <p className="text-slate-600 text-lg">
            Quản lý thông tin cá nhân và tùy chọn của bạn.
          </p>
        </div>

        <div className="space-y-8">
          <AvatarUpload
            preview={preview}
            fullName={formData.fullName}
            handleImageChange={handleImageChange}
            removeImage={removeImage}
          />

          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-purple-500 rounded-lg mr-3 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              Thông tin cá nhân
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-slate-400"
                  required
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Địa chỉ email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="user@example.com"
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-slate-400"
                required
              />
            </div>

            <div className="mt-6 space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Giới thiệu bản thân
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Viết vài dòng về bản thân..."
                rows="4"
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 resize-none placeholder-slate-400"
              />
              <p className="text-xs text-slate-500">
                {formData.bio.length}/500 ký tự
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 min-w-48 px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-3 text-white" />
                  Đang cập nhật...
                </span>
              ) : (
                "Cập nhật thông tin"
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
            >
              Đặt lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;