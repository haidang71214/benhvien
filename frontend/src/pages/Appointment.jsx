import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { assets } from "../assets/data/doctors";
import RelatedDoctors from "../components/Doctors/RelatedDoctors";
import { CalendarDays, Clock, UserCheck, Info } from "lucide-react";
import { axiosInstance } from "../utils/axiosInstance";
import { toast } from "react-hot-toast";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol } = useContext(AppContext);
  const { user } = useAuth();
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(-1);
  const [slotTime, setSlotTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const daysOfWeeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const docInfo = doctors.find((item) => item._id === docId);
    setDocInfo(docInfo);
    if (!docInfo) {
      toast.error("Bác sĩ không tồn tại");
    }
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      generateSlots();
    }
  }, [docInfo]);

  useEffect(() => {
    setSlotTime("");
  }, [slotIndex]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const generateSlots = () => {
    const slotByDate = [];
    const today = new Date();

    const randomTime = (startHour, endHour) => {
      const hour =
        Math.floor(Math.random() * (endHour - startHour)) + startHour;
      const minute = Math.random() > 0.5 ? 0 : 30;
      const date = new Date();
      date.setHours(hour, minute, 0, 0);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    for (let index = 2; index < 9; index++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + index);
      const slotCount = Math.floor(Math.random() * 5) + 2;
      const slotSet = new Set();
      const slots = [];
      while (slotSet.size < slotCount) {
        const timeStr = randomTime(9, 18);
        if (!slotSet.has(timeStr)) {
          slotSet.add(timeStr);
          slots.push({
            dateTime: new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate(),
              parseInt(timeStr.split(":")[0], 10),
              parseInt(timeStr.split(":")[1], 10)
            ),
            time: timeStr,
          });
        }
      }
      slots.sort((a, b) => a.dateTime - b.dateTime);
      slotByDate.push(slots);
    }
    setDocSlots(slotByDate);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (slotIndex === -1 || !slotTime) {
        toast.error("Vui lòng chọn ngày và giờ khám");
        return;
      }

      if (!user || !user.id) {
        toast.error("Vui lòng đăng nhập để đặt lịch");
        navigate("/auth/login");
        return;
      }

      const selectedSlot = docSlots[slotIndex].find(
        (slot) => slot.time === slotTime
      );
      const appointmentTime = selectedSlot.dateTime.toISOString();
      const patientId = user.id;
      const doctorId = docId;

      const response = await axiosInstance.post(
        "/doctor/createAppointmentFuture",
        {
          appointmentTime,
          doctorId,
        }
      );
      toast.success("Đặt lịch thành công");
      console.log(response);
      navigate("/my-appointments");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Đặt lịch thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    docInfo && (
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
              {docInfo.experience} years experience
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
                <CalendarDays className="w-5 h-5" /> Choose a Date
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {docSlots.map((daySlots, index) => {
                  const dateObj = daySlots[0]?.dateTime;
                  return (
                    <button
                      key={index}
                      onClick={() =>
                        setSlotIndex(index === slotIndex ? -1 : index)
                      }
                      className={`rounded-xl px-4 py-3 text-center text-sm font-medium border transition-all duration-300
                          ${
                            index === slotIndex
                              ? "bg-gradient-to-br from-pink-500 to-purple-500 text-white scale-105 shadow-lg"
                              : "bg-white hover:bg-pink-50 text-gray-700 border-gray-200"
                          }`}
                    >
                      <p>{daysOfWeeks[dateObj.getDay()]}</p>
                      <p className="text-lg font-bold">{dateObj.getDate()}</p>
                    </button>
                  );
                })}
              </div>

              <div>
                <h4 className="text-md font-semibold mb-2 text-purple-600 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Available Times
                </h4>
                <div className="flex flex-wrap gap-3">
                  {slotIndex >= 0 &&
                    docSlots[slotIndex].map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSlotTime(slot.time)}
                        className={`px-5 py-2 text-sm rounded-full border transition-all
                            ${
                              slotTime === slot.time
                                ? "bg-gradient-to-r from-green-400 to-blue-500 text-white shadow scale-105"
                                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                            }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                </div>
              </div>

              <div className="text-right">
                <button
                  onClick={handleSubmit}
                  disabled={!slotTime || isLoading}
                  className={`px-8 py-3 text-sm font-semibold rounded-full transition-all duration-300
                      ${
                        slotTime && !isLoading
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
    )
  );
};

export default Appointment;
