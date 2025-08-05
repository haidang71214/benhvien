import { assets } from "@/assets/data/doctors";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Shield,
  ArrowRight,
  Star,
  Clock,
} from "lucide-react";

const Header = () => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const placeholderTexts = [
    "Tìm bác sĩ, chuyên khoa, bệnh viện...",
    "Tìm kiếm theo triệu chứng...",
    "Đặt lịch khám với bác sĩ uy tín...",
    "Tư vấn sức khỏe trực tuyến...",
    "Tìm phòng khám gần nhà...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholderTexts.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="bg-slate-50 rounded-xl overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center px-6 md:px-12 lg:px-16">
        <div className="flex-1 py-16 lg:py-20 space-y-8">
          <div className="inline-flex items-center bg-blue-50 border border-blue-100 rounded-full px-4 py-2 text-blue-700 text-sm font-medium">
            <Star className="w-4 h-4 mr-2 text-blue-500" />
            Nền tảng Y tế hàng đầu Việt Nam
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Kết nối Người Dân{" "}
              <span className="text-blue-600">với Cơ sở Y tế</span> hàng đầu
            </h1>

            <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
              Đặt khám nhanh chóng, tư vấn từ xa và quản lý sức khỏe một cách
              thông minh
            </p>
          </div>

          <div className="relative max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
              <div
                className={`absolute inset-y-0 left-12 right-4 flex items-center pointer-events-none transition-all duration-300 ${
                  isAnimating
                    ? "opacity-0 transform translate-x-2"
                    : "opacity-100 transform translate-x-0"
                }`}
              >
                <span className="text-gray-500 truncate">
                  {placeholderTexts[currentPlaceholder]}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold">Đặt khám nhanh</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Lấy số thứ tự trực tuyến, tư vấn từ xa
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold">Đặt theo giờ</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Đặt sớm để có số thứ tự thấp nhất
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all md:col-span-2">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold">
                  Hoàn tiền khi hủy
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Được hoàn tiền và nhận ưu đãi đặc biệt
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/doctors"
              className="group flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Đặt khám ngay
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button className="flex items-center justify-center gap-3 border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-blue-300 hover:text-blue-600 transition-all">
              Tư vấn miễn phí
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </button>
          </div>
        </div>

        <div className="flex-1 relative py-12 lg:py-0">
          <div className="relative">
            {/* Main image */}
            <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                className="w-full h-auto rounded-xl"
                src={assets.header_img}
                alt="Minh họa bác sĩ"
              />

              {/* Rating card */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">4.9/5 ⭐</div>
                    <div className="text-sm text-gray-600">
                      Đánh giá từ bệnh nhân
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;