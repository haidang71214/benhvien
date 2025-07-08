import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { assets } from "../assets/data/doctors";
import RelatedDoctors from "../components/Doctors/RelatedDoctors";
import { CalendarDays, Clock, UserCheck, Info } from "lucide-react";
import { axiosInstance } from "../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { transformDoctorData } from "../utils/transformDoctorData";

const daysOfWeeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Appointment = () => {
  const { docId } = useParams();
  const { currencySymbol } = useContext(AppContext);
  const { user } = useAuth();
  const [docInfo, setDocInfo] = useState(null);
  const [dateButtons, setDateButtons] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [initialSymptom, setInitialSymptom] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState([]); // <-- Add this
  const navigate = useNavigate();

  // Fetch doctor info
  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get(`/admin/getDetailUser/${docId}`)
      .then((res) => {
        setDocInfo(transformDoctorData(res.data.data, "mongodb"));
      })
      .catch(() => setDocInfo(null))
      .finally(() => setIsLoading(false));
  }, [docId]);

  // Fetch all appointments for this doctor
  useEffect(() => {
    if (!docId) return;
    axiosInstance
      .get(`/doctor/getAppointmentsByUserId/${docId}`)
      .then((res) => setAppointments(res.data.data || []))
      .catch(() => setAppointments([]));
  }, [docId]);

  // Generate next 7 days that match doctor's availableDays
  useEffect(() => {
    if (!docInfo) return;
    const today = new Date();
    const buttons = [];
    let count = 0;
    let day = 0;
    while (count < 7) {
      const date = new Date(today);
      date.setDate(today.getDate() + day);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      if (
        docInfo.availableDays &&
        docInfo.availableDays.includes(dayName)
      ) {
        buttons.push({
          date,
          label: `${daysOfWeeks[date.getDay()]} ${date.getDate()}/${
            date.getMonth() + 1
          }`,
        });
        count++;
      }
      day++;
    }
    setDateButtons(buttons);
    setSelectedDate(null);
    setSelectedTime("");
  }, [docInfo]);

  // Helper: get booked times for selected date
  const getBookedTimes = () => {
    if (!selectedDate) return [];
    const selectedDateStr = selectedDate.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    return appointments
      .filter(
        (appt) =>
          appt.doctorId?._id === docId ||
          appt.doctorId === docId // in case of string
      )
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

  const handleSubmit = async () => {
  try {
    setIsLoading(true);
    if (!selectedDate || !selectedTime) {
      toast.error("Vui lòng chọn ngày và giờ khám");
      return;
    }
    if (!user || !user.id) {
      toast.error("Vui lòng đăng nhập để đặt lịch");
      navigate("/auth/login");
      return;
    }

    // Prepare booking info
    const [hour, minute] = selectedTime.split(":");
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(parseInt(hour), parseInt(minute), 0, 0);
    const appointmentTime = appointmentDate.toISOString();
    const doctorId = docId;

    // Only request payment link, do NOT create appointment yet
    const payRes = await axiosInstance.post(
      "/api/v1/payment/create-payment-link",
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
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="bg-white rounded-2xl shadow-md p-6 w-full lg:w-1/3 border border-pink-100">
          <img
            src={docInfo.image}
            alt={docInfo.name}
            className="rounded-xl w-full h-64 object-cover border-4 border-pink-200 shadow"
          />
          <h2 className="text-2xl font-bold text-pink-600 mt-4 flex items-center gap-2">
            {docInfo.name}
            <img className="w-5" src={assets.verified_icon} alt="Verified" />
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {docInfo.degree} • {docInfo.speciality}
          </p>
          <div className="mt-2 text-sm font-medium bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full inline-block">
            {docInfo.experience} experience
          </div>
          <div className="mt-4">
            <p className="flex items-center text-purple-700 font-semibold gap-2 mb-1">
              <Info className="w-4 h-4" /> About
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {docInfo.about}
            </p>
          </div>
          <p className="text-green-600 font-bold mt-4">
            💰 Fee: {currencySymbol}
            {docInfo.fees}
          </p>
        </div>

        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-md space-y-6">
            <h3 className="text-xl font-bold text-pink-600 flex items-center gap-2">
              <CalendarDays className="w-5 h-5" /> Chọn ngày khám
            </h3>
            <div className="flex flex-wrap gap-3">
              {dateButtons.map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedDate(btn.date);
                    setSelectedTime("");
                  }}
                  className={`rounded-xl px-4 py-3 text-center text-sm font-medium border transition-all duration-300
                    ${
                      selectedDate &&
                      btn.date.toDateString() === selectedDate.toDateString()
                        ? "bg-gradient-to-br from-pink-500 to-purple-500 text-white scale-105 shadow-lg"
                        : "bg-white hover:bg-pink-50 text-gray-700 border-gray-200"
                    }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <div>
              <h4 className="text-md font-semibold mb-2 text-purple-600 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Chọn giờ khám
              </h4>
              <div className="flex flex-wrap gap-3">
                {selectedDate &&
                  docInfo.availableTimes &&
                  docInfo.availableTimes.map((time) => {
                    const isBooked = bookedTimes.includes(time);
                    return (
                      <button
                        key={time}
                        onClick={() => !isBooked && setSelectedTime(time)}
                        disabled={isBooked}
                        className={`px-5 py-2 text-sm rounded-full border transition-all
                          ${
                            isBooked
                              ? "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
                              : selectedTime === time
                              ? "bg-gradient-to-r from-green-400 to-blue-500 text-white shadow scale-105"
                              : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                          }`}
                      >
                        {time}
                        {isBooked && " (Đã đặt)"}
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
                onChange={e => setInitialSymptom(e.target.value)}
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