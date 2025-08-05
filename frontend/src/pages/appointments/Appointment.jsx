import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { assets } from "../../assets/data/doctors";
import RelatedDoctors from "../../pages/doctors/RelatedDoctors";
import { CalendarDays, Clock, UserCheck, Info } from "lucide-react";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";

const Appointment = () => {
  // thường thì cái này lấy cái params của phía bác sĩ thôi á, không cần truyền vào params của user đâu, cái userId có trong chỗ localStorage rồi
  const { docId } = useParams();
  const { currencySymbol } = useContext(AppContext);
  const { user } = useAuth();
  const [docInfo, setDocInfo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [initialSymptom, setInitialSymptom] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  console.log(docInfo);
  
  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get(`/admin/getDetailUser/${docId}`)
      .then((res) => {
        setDocInfo(res.data.data);
      })
      .catch(() => setDocInfo(null))
      .finally(() => setIsLoading(false));
  }, [docId]);

  useEffect(() => {
    if (!docId) return;
    axiosInstance
      .get(`/doctor/getAppointmentsByUserId/${docId}`)
      .then((res) => setAppointments(res.data.data || []))
      .catch(() => setAppointments([]));
  }, [docId]);

  const getBookedTimes = () => {
    if (!selectedDate) return [];
    const selectedDateStr = selectedDate.toISOString().slice(0, 10);
    return appointments
      .filter((appt) => appt.doctorId?._id === docId || appt.doctorId === docId)
      .filter((appt) => {
        const apptDateStr = new Date(appt.appointmentTime)
          .toISOString()
          .slice(0, 10);
        return apptDateStr === selectedDateStr;
      })
      .map((appt) => {
        const d = new Date(appt.appointmentTime);
        return d
          .toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
          .slice(0, 5); // "HH:mm"
      });
  };

  const bookedTimes = getBookedTimes();

  const getAvailableTimes = () => {
    if (!selectedDate || !docInfo || !docInfo.availableSchedule) return [];
    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    return docInfo.availableSchedule[dayName] || [];
  };

  const availableTimes = getAvailableTimes();

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Vui lòng chọn ngày và giờ khám");
      return;
    }
    if (!user || !user.id) {
      toast.error("Vui lòng đăng nhập để đặt lịch");
      navigate("/auth/login");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmBooking = async () => {
    try {
      setIsLoading(true);
      setShowConfirm(false);
      // Prepare booking info
      const [hour, minute] = selectedTime.split(":");
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(parseInt(hour), parseInt(minute), 0, 0);
      const appointmentTime = appointmentDate.toISOString();
      const doctorId = docId;

      const payRes = await axiosInstance.post(
        "/payment/create-payment-link",
        {
          appointmentTime,
          doctorId,
          initialSymptom,
          amount: docInfo.fees,
          patientId: user.id,
        }
      );

      window.location.href = payRes.data.url;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Đặt lịch thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  if (!docInfo) {
    return (
      <div className="pt-32 text-center text-gray-500 text-lg">
        Đang tải thông tin bác sĩ...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-[7rem] space-y-10">
      {/* Booking Overview Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-pink-600">
              Xác nhận đặt lịch
            </h2>
            <div className="space-y-2 text-gray-700">
              <div>
                <b>Bác sĩ:</b> {docInfo?.name}
              </div>
              <div>
                <b>Chuyên khoa:</b> {docInfo?.speciality}
              </div>
              <div>
                <b>Ngày khám:</b>{" "}
                {selectedDate && selectedDate.toLocaleDateString("vi-VN")}
              </div>
              <div>
                <b>Giờ khám:</b> {selectedTime}
              </div>
              <div>
                <b>Triệu chứng:</b>{" "}
                {initialSymptom || (
                  <span className="italic text-gray-400">(Chưa nhập)</span>
                )}
              </div>
              <div>
                <b>Phí khám:</b> {currencySymbol}
                {docInfo?.fees}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                onClick={() => setShowConfirm(false)}
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold hover:scale-105 shadow"
                onClick={handleConfirmBooking}
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Xác nhận & Thanh toán"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="bg-white rounded-2xl shadow-md p-0 w-full lg:w-1/3 border border-pink-100 overflow-hidden flex flex-col">
          <div className="relative">
            <img
              src={docInfo.avatarUrl}
              alt={docInfo.name}
              className="rounded-t-2xl w-full h-64 object-cover border-b-4 border-pink-200 shadow"
            />
            <span className="absolute top-4 right-4 bg-gradient-to-br from-pink-400 to-purple-400 text-black px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
              <img className="w-4" src={assets.verified_icon} alt="Verified" />
              Đã xác thực
            </span>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h2 className="text-2xl font-bold text-pink-600 mt-2 flex items-center gap-2">
              {docInfo.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {docInfo.degree} • {docInfo.speciality}
            </p>
            <div className="mt-2 text-sm font-medium bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full inline-block">
              {docInfo.experience} kinh nghiệm
            </div>
            <div className="mt-4">
              <p className="flex items-center text-purple-700 font-semibold gap-2 mb-1">
                <Info className="w-4 h-4" /> Thông tin bác sĩ
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {docInfo.about}
              </p>
            </div>
            {/* với lại muốn đăng kí doctor thì có cần admin confirm không? */}
            {/* doctor có fees riêng đúng hong */}
            <p className="text-green-600 font-bold mt-4 text-lg flex items-center gap-2">
              <span className="text-2xl">💰</span> Phí khám: {currencySymbol}
              {docInfo.fees}
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-md space-y-6">
            {/* Removed duplicate heading for date selection */}
            <div className="flex flex-col gap-2 mb-6">
              <label className="flex items-center gap-2 text-lg font-bold text-[#e6007e] mb-2">
                <CalendarDays className="w-6 h-6" />
                Chọn ngày khám
              </label>
              <div className="relative w-full max-w-xs">
                <input
                  type="date"
                  className="appearance-none w-full rounded-full px-5 py-3 text-lg font-semibold border border-[#e6007e] shadow focus:outline-none focus:ring-2 focus:ring-[#e6007e] bg-white text-gray-700 transition-all duration-300 hover:border-[#e6007e]"
                  value={
                    selectedDate ? selectedDate.toISOString().slice(0, 10) : ""
                  }
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    setSelectedDate(date);
                    setSelectedTime("");
                  }}
                  min={new Date().toISOString().slice(0, 10)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#e6007e] pointer-events-none">
                  {/* <CalendarDays className="w-6 h-6" /> */}
                </span>
              </div>
              {/* Only display picked date here, remove duplicate elsewhere */}
            </div>
            <div>
              <h4 className="text-md font-semibold mb-2 text-purple-600 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Chọn giờ khám
              </h4>
              <div className="flex flex-wrap gap-3 mt-2">
                {selectedDate &&
                  availableTimes.map((time) => {
                    const isBooked = bookedTimes.includes(time);
                    return (
                      <button
                        key={time}
                        onClick={() => !isBooked && setSelectedTime(time)}
                        disabled={isBooked}
                        className={`px-6 py-3 text-md rounded-full border font-semibold transition-all duration-200 shadow-sm
                          ${
                            isBooked
                              ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                              : selectedTime === time
                              ? "bg-gradient-to-r from-[#e6007e] to-[#00bcd4] text-black shadow-lg scale-105"
                              : "bg-white text-gray-700 border-[#e6007e] hover:bg-[#fce4ec] hover:border-[#e6007e]"
                          }`}
                      >
                        <span
                          className={
                            selectedTime === time ? "font-bold text-lg" : ""
                          }
                        >
                          {time}
                        </span>
                        {isBooked && (
                          <span className="ml-2 text-xs text-gray-400">
                            (Đã đặt)
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-2 text-pink-600 flex items-center gap-2">
                <Info className="w-4 h-4" /> Triệu chứng ban đầu
              </h4>
              <textarea
                className="w-full border rounded-lg p-3 text-sm"
                rows={3}
                placeholder="Nhập triệu chứng ban đầu của bạn..."
                value={initialSymptom}
                onChange={(e) => setInitialSymptom(e.target.value)}
              />
            </div>
            <div className="text-right">
              <button
                onClick={handleSubmit}
                disabled={!selectedDate || !selectedTime || isLoading}
                className={`px-8 py-3 text-sm font-semibold rounded-full transition-all duration-300
                  ${
                    selectedDate && selectedTime && !isLoading
                      ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:scale-105 shadow"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                <UserCheck className="inline w-4 h-4 mr-2" />
                {isLoading ? "Đang xử lý..." : "Book Appointment"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    </div>
  );
};

export default Appointment;
