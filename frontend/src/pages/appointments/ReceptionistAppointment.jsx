import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";

const ReceptionistAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/doctor/getAllAppointments")
      .then((res) => setAppointments(res.data.data || []))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="pt-32 text-center text-gray-500 text-lg">
        Đang tải danh sách lịch hẹn...
      </div>
    );

  if (!appointments.length)
    return (
      <div className="pt-32 text-center text-gray-500 text-lg">
        Không tìm thấy lịch hẹn nào.
      </div>
    );

  // Hàm format trạng thái tiếng Việt
  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Đang chờ";
      case "confirmed":
        return "Đã xác nhận";
      case "completed":
        return "Hoàn tất";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không rõ";
    }
  };

  return (
    <div className="max-w-5xl mx-auto pt-24 px-4">
      <h2 className="text-3xl font-bold mb-8 text-blue-700">Tất cả lịch hẹn</h2>

      <ul className="space-y-4">
        {appointments.map((appt) => (
          <li
            key={appt._id}
            className="p-6 bg-white rounded-2xl shadow border border-blue-100 hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-gray-700">
                  <span className="font-semibold">Bệnh nhân:</span>{" "}
                  {appt.patientId?.userName || appt.patientId}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Bác sĩ:</span>{" "}
                  {appt.doctorId?.userName || appt.doctorId}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold">Thời gian:</span>{" "}
                  {new Date(appt.appointmentTime).toLocaleString("vi-VN")}
                </p>
                <p className="text-sm mt-1">
                  <span className="font-semibold">Trạng thái:</span>{" "}
                  <span
                    className={
                      appt.status === "pending"
                        ? "text-yellow-600 font-semibold"
                        : appt.status === "confirmed"
                        ? "text-green-600 font-semibold"
                        : appt.status === "completed"
                        ? "text-blue-600 font-semibold"
                        : appt.status === "cancelled"
                        ? "text-red-600 font-semibold"
                        : "text-gray-700 font-semibold"
                    }
                  >
                    {getStatusLabel(appt.status)}
                  </span>
                </p>
              </div>

              <button
                className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:scale-105 transition-transform"
                onClick={() => navigate(`/reschedule-appointment/${appt._id}`)}
              >
                Đặt lại lịch
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReceptionistAppointments;
