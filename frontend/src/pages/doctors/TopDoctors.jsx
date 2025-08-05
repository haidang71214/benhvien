import { useState, useEffect } from "react";
import {
  Star,
  Users,
  ChevronRight,
  Stethoscope,
  Heart,
  Award,
  Clock,
  MapPin,
} from "lucide-react";
import { axiosInstance } from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const TopDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axiosInstance.get("/admin/getAllDoctors");
        setDoctors(res.data.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách bác sĩ:", err);
      }
    };

    fetchDoctors();
  }, []);

  const handleDoctorClick = (doctorId) => {
    if (!user || !user.id) {
      toast.success("Vui lòng đăng nhập để đặt lịch khám với bác sĩ.");
      navigate("/auth/login");
      window.scrollTo(0, 0);
      return;
    }

    navigate(`/appointment/${doctorId}/${user.id}`);
  };

  const getAvailabilityColor = (availability = "") => {
    if (availability.includes("ngay") || availability.includes("hôm nay")) {
      return "bg-green-100 text-green-800 border-green-200";
    }
    if (availability.includes("mai")) {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-3 h-3 fill-yellow-400 text-yellow-400" />
      );
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              BÁC SĨ TƯ VẤN KHÁM BỆNH
            </h1>
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Đặt lịch khám với các bác sĩ hàng đầu, được tin tưởng bởi hàng nghìn
            bệnh nhân
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 text-center hover:scale-105 transition">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">5000+</h3>
            <p className="text-gray-600">Bệnh nhân tin tưởng</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 text-center hover:scale-105 transition">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">50+</h3>
            <p className="text-gray-600">Bác sĩ chuyên khoa</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 text-center hover:scale-105 transition">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">24/7</h3>
            <p className="text-gray-600">Hỗ trợ khách hàng</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className={`group bg-white rounded-3xl shadow-lg border overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                hoveredCard === doctor._id ? "ring-4 ring-blue-200" : ""
              }`}
              onClick={() => handleDoctorClick(doctor._id)}
              onMouseEnter={() => setHoveredCard(doctor._id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={doctor.avatarUrl || "/images/default-doctor.jpg"}
                  alt={doctor.userName}
                  className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition" />
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold border ${getAvailabilityColor(
                    doctor.availability
                  )}`}
                >
                  {doctor.availability || "Chưa rõ"}
                </div>
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                  {doctor.experience || "Chưa rõ kinh nghiệm"}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {renderStars(doctor.ratings)}
                    <span className="text-sm font-bold text-amber-600">
                      {doctor.ratings || "0.0"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full">
                    <Users className="w-3 h-3 text-orange-500" />
                    <span className="text-xs font-semibold text-orange-600">
                      {doctor.consultations?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-blue-600 transition">
                  {doctor.userName}
                </h3>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <Stethoscope className="w-3 h-3 text-blue-500" />
                    {doctor.speciality?.join(", ") ||
                      "Chuyên khoa chưa cập nhật"}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-green-500" />
                    {doctor.hospital || "Cơ sở chưa rõ"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Award className="w-3 h-3 text-purple-500" />
                    {doctor.degree || "Học vị chưa rõ"}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Phí tư vấn:</span>
                  <span className="text-lg font-bold text-green-600">
                    {doctor.fees
                      ? `${doctor.fees.toLocaleString()}đ`
                      : "Miễn phí"}
                  </span>
                </div>

                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDoctorClick(doctor._id);
                  }}
                >
                  <span className="flex items-center justify-center gap-2">
                    Đặt lịch ngay <ChevronRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopDoctors;