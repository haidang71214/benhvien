  import {
    ChevronRight,
    Users,
    MapPin,
    Award,
    Stethoscope,
  } from "lucide-react";

  const DoctorCard = ({
    doctor,
    hoveredCard,
    setHoveredCard,
    handleDoctorClick,
    renderStars,
    getAvailabilityColor,
  }) => {
    return (
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
              {doctor.speciality?.join(", ") || "Chuyên khoa chưa cập nhật"}
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
              {doctor.fees ? `${doctor.fees.toLocaleString()}đ` : "Miễn phí"}
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
    )
  };

  export default DoctorCard;