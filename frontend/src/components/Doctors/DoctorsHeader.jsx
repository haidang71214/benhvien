import { Stethoscope, CircleDot } from "lucide-react";

const DoctorsHeader = ({
  selectedSpecialty,
  loading,
  error,
  filteredDoctors,
}) => {
  return (
    <div className="from-white via-slate-50 to-white shadow-lg rounded-2xl border border-slate-200 p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-700">
            <Stethoscope className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {selectedSpecialty
                ? `Chuyên khoa: ${selectedSpecialty}`
                : "Danh sách bác sĩ"}
            </h2>
          </div>

          {!loading && !error && (
            <div className="text-gray-600 flex items-center gap-2 text-sm">
              <CircleDot className="w-3 h-3 text-green-500 animate-pulse" />
              {filteredDoctors.length > 0
                ? `${filteredDoctors.length} bác sĩ đang khả dụng`
                : "Không tìm thấy bác sĩ nào"}
            </div>
          )}
        </div>

        {!loading && !error && filteredDoctors.length > 0 && (
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Có lịch hôm nay</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Đã xác thực</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsHeader;