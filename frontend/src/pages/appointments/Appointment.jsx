import { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { transformDoctorData } from "../../utils/transformDoctorData";
import RelatedDoctors from "../doctors/RelatedDoctors";
import DoctorInfo from "../../components/doctors/DoctorInfo";
import BookingScheduler from "../../components/doctors/BookingScheduler";

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
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!docId) return;
    axiosInstance
      .get(`/doctor/getAppointmentsByUserId/${docId}`)
      .then((res) => setAppointments(res.data.data || []))
      .catch(() => setAppointments([]));
  }, [docId]);

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
      if (docInfo.availableDays?.includes(dayName)) {
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

  const bookedTimes = useMemo(() => {
    if (!selectedDate) return [];
    const selectedDateStr = selectedDate.toISOString().slice(0, 10);
    return appointments
      .filter(
        (appt) =>
          (appt.doctorId?._id || appt.doctorId) === docId &&
          new Date(appt.appointmentTime).toISOString().slice(0, 10) ===
            selectedDateStr
      )
      .map((appt) =>
        new Date(appt.appointmentTime)
          .toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
          .slice(0, 5)
      );
  }, [appointments, selectedDate]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (!selectedDate || !selectedTime) {
        toast.error("Vui lòng chọn ngày và giờ khám");
        return;
      }
      if (!user?.id) {
        toast.error("Vui lòng đăng nhập để đặt lịch");
        navigate("/auth/login");
        return;
      }

      toast.success(
        "Đặt lịch thành công! Đang chuyển hướng đến trang thanh toán..."
      );

      const [hour, minute] = selectedTime.split(":");
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(+hour, +minute, 0, 0);
      const appointmentTime = appointmentDate.toISOString();

      const payRes = await axiosInstance.post(
        "/api/v1/payment/create-payment-link",
        {
          appointmentTime,
          doctorId: docId,
          initialSymptom,
          amount: docInfo.fees,
          patientId: user.id,
        }
      );

      setTimeout(() => {
        window.location.href = payRes.data.url;
      }, 2000);
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
        <DoctorInfo docInfo={docInfo} currencySymbol={currencySymbol} />
        <div className="flex-1 space-y-6">
          <BookingScheduler
            dateButtons={dateButtons}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            availableTimesByDate={docInfo.availableTimesByDate}
            bookedTimes={bookedTimes}
            initialSymptom={initialSymptom}
            setSelectedDate={setSelectedDate}
            setSelectedTime={setSelectedTime}
            setInitialSymptom={setInitialSymptom}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="mt-10">
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    </div>
  );
};

export default Appointment;
