import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { Info, CalendarDays, Clock, UserCheck } from "lucide-react";
import { assets } from "../../assets/data/doctors";


const RescheduleAppointment = () => {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch current appointment info
  useEffect(() => {
    axiosInstance
      .get(`/doctor/getAppointmentById/${appointmentId}`)
      .then((res) => {
        setAppointment(res.data.data);
        return res.data.data;
      })
      .then((appt) => {
        // Fetch doctor info
        return axiosInstance.get(`/admin/getDetailUser/${appt.doctorId._id}`);
      })
      .then((res) => setDoctor(res.data.data))
      .catch(() => toast.error("Không thể tải thông tin lịch hẹn hoặc bác sĩ"));
  }, [appointmentId]);

  // Fetch all appointments for this doctor
  useEffect(() => {
    if (!doctor?._id) return;
    axiosInstance
      .get(`/doctor/getAppointmentsByUserId/${doctor._id}`)
      .then((res) => setAppointments(res.data.data || []))
      .catch(() => setAppointments([]));
  }, [doctor]);

  // Date picker min date (today)
  const minDate = new Date().toISOString().slice(0, 10);

  // Pre-select the old date when data is loaded
  useEffect(() => {
    if (appointment && doctor) {
      const oldDate = new Date(appointment.appointmentTime);
      setSelectedDate(oldDate);
      setSelectedTime(""); // Don't pre-select time, force user to pick a new one
    }
  }, [appointment, doctor]);

  // Get booked times for selected date (excluding the current appointment)
  const getBookedTimes = () => {
    if (!selectedDate) return [];
    const selectedDateStr = selectedDate.toISOString().slice(0, 10);
    return appointments
      .filter((appt) => appt._id !== appointmentId)
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
          .slice(0, 5);
      });
  };

  const bookedTimes = getBookedTimes();

  // Get available times for selected date (like Appointment.jsx)
  const getAvailableTimes = () => {
    if (!selectedDate || !doctor || !doctor.availableSchedule) return [];
    const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
    return doctor.availableSchedule[dayName] || [];
  };

  const availableTimes = getAvailableTimes();

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Vui lòng chọn ngày và giờ mới");
      return;
    }
    setIsLoading(true);
    try {
      const [hour, minute] = selectedTime.split(":");
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(hour), parseInt(minute), 0, 0);
      await axiosInstance.put(`/doctor/updateAppointment/${appointmentId}`, {
        newTime: newDate.toISOString(),
      });
      toast.success("Đổi lịch thành công!");
      navigate("/receptionist-appointments");
    } catch (err) {
      toast.error(err.response?.data?.message || "Đổi lịch thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  if (!appointment || !doctor)
    return <div className="pt-32 text-center text-gray-500 text-lg">Đang tải...</div>;


  // Get old appointment time for marking
  let oldDateStr = "";
  let oldTime = "";
  if (appointment) {
    const oldDate = new Date(appointment.appointmentTime);
    oldDateStr = oldDate.toISOString().slice(0, 10);
    oldTime = oldDate
      .toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
      .slice(0, 5);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-[7rem] space-y-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
      >
        ← Back
      </button>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Doctor Info Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 w-full lg:w-1/3 border border-pink-100">
          <img
            src={doctor.avatarUrl || doctor.image || assets.default_doctor}
            alt={doctor.userName || doctor.name}
            className="rounded-xl w-full h-64 object-cover border-4 border-pink-200 shadow"
          />
          <h2 className="text-2xl font-bold text-pink-600 mt-4 flex items-center gap-2">
            {doctor.userName || doctor.name}
            <img className="w-5" src={assets.verified_icon} alt="Verified" />
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {doctor.degree} • {doctor.speciality}
          </p>
          <div className="mt-2 text-sm font-medium bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full inline-block">
            {doctor.experience} experience
          </div>
          <div className="mt-4">
            <p className="flex items-center text-purple-700 font-semibold gap-2 mb-1">
              <Info className="w-4 h-4" /> About
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {doctor.about}
            </p>
          </div>
        </div>
        {/* Reschedule Form */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-md space-y-6">
            <h2 className="text-2xl font-bold mb-2 text-blue-700">Đổi lịch hẹn cho bệnh nhân</h2>
            <div className="mb-4 p-4 bg-blue-50 rounded">
              <div>
                <span className="font-semibold">Bệnh nhân:</span>{" "}
                {appointment.patientId?.userName || appointment.patientId}
              </div>
              <div>
                <span className="font-semibold">Lịch cũ:</span>{" "}
                <span className="text-red-600 font-semibold">
                  {new Date(appointment.appointmentTime).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-6">
              <label className="flex items-center gap-2 text-lg font-bold text-[#e6007e] mb-2">
                <CalendarDays className="w-6 h-6" />
                Chọn ngày mới
              </label>
              <div className="relative w-full max-w-xs">
                <input
                  type="date"
                  className="appearance-none w-full rounded-full px-5 py-3 text-lg font-semibold border border-[#e6007e] shadow focus:outline-none focus:ring-2 focus:ring-[#e6007e] bg-white text-gray-700 transition-all duration-300 hover:border-[#e6007e]"
                  value={selectedDate ? selectedDate.toISOString().slice(0, 10) : ""}
                  onChange={e => {
                    const date = new Date(e.target.value);
                    setSelectedDate(date);
                    setSelectedTime("");
                  }}
                  min={minDate}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#e6007e] pointer-events-none">
                  {/* <CalendarDays className="w-6 h-6" /> */}
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-2 text-purple-600 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Chọn giờ mới
              </h4>
              <div className="flex flex-wrap gap-3 mt-2">
                {selectedDate &&
                  availableTimes.map((time) => {
                    const isBooked = bookedTimes.includes(time);

                    // Mark old appointment time as "current" and disable it
                    let isCurrentTime = false;
                    const selectedDateStr = selectedDate.toISOString().slice(0, 10);
                    if (oldDateStr === selectedDateStr && oldTime === time) {
                      isCurrentTime = true;
                    }

                    return (
                      <button
                        key={time}
                        onClick={() => !isBooked && !isCurrentTime && setSelectedTime(time)}
                        disabled={isBooked || isCurrentTime}
                        className={`px-6 py-3 text-md rounded-full border font-semibold transition-all duration-200 shadow-sm
                          ${
                            isBooked
                              ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                              : isCurrentTime
                              ? "bg-yellow-300 text-yellow-800 cursor-not-allowed border-yellow-400"
                              : selectedTime === time
                              ? "bg-gradient-to-r from-[#e6007e] to-[#00bcd4] text-black shadow-lg scale-105"
                              : "bg-white text-gray-700 border-[#e6007e] hover:bg-[#fce4ec] hover:border-[#e6007e]"
                          }`}
                      >
                        <span className={selectedTime === time ? "font-bold text-lg" : ""}>
                          {time}
                        </span>
                        {isBooked && <span className="ml-2 text-xs text-gray-400">(Đã đặt)</span>}
                        {isCurrentTime && <span className="ml-2 text-xs text-yellow-800">(Hiện tại)</span>}
                      </button>
                    );
                  })}
              </div>
            </div>
            <div className="text-right mt-6">
              <button
                onClick={handleReschedule}
                disabled={!selectedDate || !selectedTime || isLoading}
                className={`px-8 py-3 text-sm font-semibold rounded-full transition-all duration-300
                  ${
                    selectedDate && selectedTime && !isLoading
                      ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:scale-105 shadow"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                <UserCheck className="inline w-4 h-4 mr-2" />
                {isLoading ? "Đang xử lý..." : "Đổi lịch"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescheduleAppointment;