import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { assets } from "../../assets/data/doctors";
import RelatedDoctors from "../../pages/doctors/RelatedDoctors";
import { CalendarDays, Clock, UserCheck, Info } from "lucide-react";
import { axiosInstance, SOCKET_URL } from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import { useChat } from "../../context/ChatContext";
import SliderChatUser from "../../context/SliderChatUse";
import { ChatWindow } from "./ChatWindow";
import {
  formatDate,
  isValidDate,
  dateToLocalString,
} from "../../utils/dateUtils";
import useDoctorDetail from "../../hooks/useDoctorDetail";

const Appointment = () => {
  const { docId } = useParams();
  const socket = useMemo(() => io(`${SOCKET_URL}`), []);
  const { user } = useAuth();
  const { openChat, isChatOpen, currentConversationId, closeChat } = useChat();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [initialSymptom, setInitialSymptom] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const navigate = useNavigate();

  const { doctor: docInfo, loading: isLoadingDoc } = useDoctorDetail(docId);

  useEffect(() => {
    if (!docId) return;
    axiosInstance
      .get(`/doctor/getAppointmentsByUserId/${docId}`)
      .then((res) => setAppointments(res.data.data || []))
      .catch(() => setAppointments([]));
  }, [docId]);

  useEffect(() => {
    if (!user?.id || !docId) return;

    const fetchConversation = async () => {
      try {
        const response = await axiosInstance.get(
          `/chat/getAllConversation/${user.id}`
        );
        const conversations = Array.isArray(response.data)
          ? response.data
          : [response.data];
        const existingConversation = conversations.find((conv) =>
          conv.participants.some((p) => p?._id === docId)
        );
        if (existingConversation) {
          setConversationId(existingConversation._id);
        } else {
          const newConv = await axiosInstance.post("/chat/checkCC", {
            participants: [user.id, docId],
          });
          setConversationId(newConv.data?._id);
        }
      } catch (error) {
        console.error("Error fetching/creating conversation:", error);
        toast.error("Không thể kiểm tra cuộc trò chuyện");
      }
    };

    fetchConversation();
  }, [user?.id, docId]);

  const { availableTimes, bookedTimes } = useMemo(() => {
    if (!isValidDate(selectedDate) || !docInfo?.availableSchedule) {
      return { availableTimes: [], bookedTimes: [] };
    }

    const selectedDateStr = dateToLocalString(selectedDate);
    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const allBookedTimes = appointments
      .filter(
        (appt) =>
          (appt.doctorId?._id === docId || appt.doctorId === docId) &&
          dateToLocalString(new Date(appt.appointmentTime)) === selectedDateStr
      )
      .map((appt) =>
        new Date(appt.appointmentTime)
          .toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
          .slice(0, 5)
      );

    return {
      availableTimes: docInfo.availableSchedule[dayName] || [],
      bookedTimes: allBookedTimes,
    };
  }, [selectedDate, appointments, docInfo, docId]);

  const handleSubmit = () => {
    if (!isValidDate(selectedDate) || !selectedTime) {
      toast.error("Vui lòng chọn ngày và giờ khám");
      return;
    }
    if (!user?.id) {
      // Rút gọn kiểm tra user
      toast.error("Vui lòng đăng nhập để đặt lịch");
      navigate("/auth/login");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmBooking = async () => {
    try {
      if (!isValidDate(selectedDate) || !selectedTime) {
        toast.error("Vui lòng chọn ngày và giờ khám");
        return;
      }
      setIsLoading(true);
      setShowConfirm(false);
      const [hour, minute] = selectedTime.split(":");
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(parseInt(hour), parseInt(minute), 0, 0);
      const appointmentTime = appointmentDate.toISOString();
      const doctorId = docId;

      const payRes = await axiosInstance.post("/payment/create-payment-link", {
        appointmentTime,
        doctorId,
        initialSymptom,
        amount: docInfo.fees,
        patientId: user.id,
      });

      window.location.href = payRes.data.url;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Đặt lịch thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatAction = async () => {
    if (!user?.id || !docId || !socket) {
      toast.error("Thiếu dữ liệu để tạo tin nhắn!");
      return;
    }

    try {
      let convId = conversationId;
      if (!convId) {
        const response = await axiosInstance.post("/chat/createConversation", {
          participants: [user.id, docId],
        });
        if (response.data?._id) {
          convId = response.data._id;
          setConversationId(convId);
          toast.success("Đã tạo cuộc trò chuyện mới!");
        } else {
          throw new Error("Không thể tạo cuộc trò chuyện");
        }
      }

      socket.emit("joinRoom", convId);
      socket.emit("sendMessage", {
        conversationId: convId,
        senderId: user.id,
        content: initialSymptom || "Xin chào bác sĩ, tôi muốn tư vấn.",
      });
      openChat(convId, docId);
    } catch (error) {
      console.error("Error in handleChatAction:", error);
      toast.error(
        error.response?.data?.message || "Không thể bắt đầu cuộc trò chuyện"
      );
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
      {/* Booking Confirmation Modal */}
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
                <b>Chuyên khoa:</b>{" "}
                {Array.isArray(docInfo?.speciality)
                  ? docInfo.speciality.join(", ")
                  : docInfo?.speciality}
              </div>
              <div>
                <b>Ngày khám:</b> {selectedDate && formatDate(selectedDate)}
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
                <b>Phí khám:</b>{" "}
                {docInfo?.fees
                  ? `${docInfo.fees.toLocaleString()}đ`
                  : "Miễn phí"}
              </div>
              <button
                onClick={handleChatAction}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {conversationId ? "Tiếp tục chat" : "Bắt đầu chat"}
              </button>
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
              alt={docInfo.userName}
              className="rounded-t-2xl w-full h-64 object-cover border-b-4 border-pink-200 shadow"
            />
            <span className="absolute top-4 right-4 bg-gradient-to-br from-pink-400 to-purple-400 text-black px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
              <img className="w-4" src={assets.verified_icon} alt="Verified" />
              Đã xác thực
            </span>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h2 className="text-2xl font-bold text-pink-600 mt-2 flex items-center gap-2">
              {docInfo.userName}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {docInfo.degree} •{" "}
              {Array.isArray(docInfo.speciality)
                ? docInfo.speciality.join(", ")
                : docInfo.speciality}
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
            <button
              onClick={handleChatAction}
              className="chat-button" // Sử dụng class CSS thay cho inline style
            >
              {conversationId ? "Tiếp tục chat" : "Bắt đầu chat"}
            </button>
            <p className="text-green-600 font-bold mt-4 text-lg flex items-center gap-2">
              <span className="text-2xl">💰</span> Phí khám:{" "}
              {docInfo.fees ? `${docInfo.fees.toLocaleString()}đ` : "Miễn phí"}
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-md space-y-6">
            <div className="flex flex-col gap-2 mb-6">
              <label className="flex items-center gap-2 text-lg font-bold text-[#e6007e] mb-2">
                <CalendarDays className="w-6 h-6" />
                Chọn ngày khám
              </label>
              <div className="relative w-full max-w-xs">
                <input
                  type="date"
                  className="appearance-none w-full rounded-full px-5 py-3 text-lg font-semibold border border-[#e6007e] shadow focus:outline-none focus:ring-2 focus:ring-[#e6007e] bg-white text-gray-700 transition-all duration-300 hover:border-[#e6007e]"
                  value={selectedDate ? dateToLocalString(selectedDate) : ""}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    setSelectedDate(date);
                    setSelectedTime("");
                  }}
                  min={dateToLocalString(new Date())}
                />
              </div>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-2 text-purple-600 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Chọn giờ khám
              </h4>
              <div className="flex flex-wrap gap-3 mt-2">
                {isValidDate(selectedDate) &&
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
                disabled={
                  !isValidDate(selectedDate) || !selectedTime || isLoading
                }
                className={`px-8 py-3 text-sm font-semibold rounded-full transition-all duration-300
                                    ${
                                      isValidDate(selectedDate) &&
                                      selectedTime &&
                                      !isLoading
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
        {isChatOpen && (
          <>
            <SliderChatUser
              onClose={closeChat}
              onSelectConversation={(convId) => openChat(convId, docId)}
            />
            <ChatWindow
              socket={socket}
              conversationId={currentConversationId}
              userId={user?.id}
            />
          </>
        )}
      </div>
      <div className="mt-10">
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    </div>
  );
};

export default Appointment;
