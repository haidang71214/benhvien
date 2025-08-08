import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import { axiosInstance, SOCKET_URL } from "../../utils/axiosInstance";
import { isValidDate } from "../../utils/dateUtils";

// Custom Hooks
import { useAppointments } from "../../hooks/useAppointments";
import { useConversation } from "../../hooks/useConversation";
import { useSchedule } from "../../hooks/useSchedule";
import useDoctorDetail from "../../hooks/useDoctorDetail";

// Services
import { appointmentService } from "../../services/appointmentService";
import { chatService } from "../../services/chatService";

// Components
import DoctorInfoCard from "../../components/Doctors/DoctorInfoCard";
import BookingForm from "../../components/BookingForm";
import BookingModal from "../../components/BookingModal";
import SliderChatUser from "../../context/SliderChatUse";
import { ChatWindow } from "./ChatWindow";
import RelatedDoctors from "../../pages/doctors/RelatedDoctors";

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const socket = useMemo(() => io(`${SOCKET_URL}`), []);
  const { user } = useAuth();
  console.log(user);

  const { openChat, isChatOpen, currentConversationId, closeChat } = useChat();

  // State
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [initialSymptom, setInitialSymptom] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Custom hooks
  const { doctor: docInfo } = useDoctorDetail(docId);
  const appointments = useAppointments(docId);
  const [conversationId, setConversationId] = useConversation(user?.id, docId);
  const { availableTimes, bookedTimes } = useSchedule(
    selectedDate,
    appointments,
    docInfo,
    docId
  );

  // Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidDate(selectedDate) || !selectedTime) {
      toast.error("Vui lòng chọn ngày và giờ khám");
      return;
    }
    if (!user?.id) {
      toast.error("Vui lòng đăng nhập để đặt lịch");
      navigate("/auth/login");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!isValidDate(selectedDate) || !selectedTime) {
      toast.error("Vui lòng chọn ngày và giờ khám");
      return;
    }

    try {
      setIsLoading(true);
      setShowConfirm(false);

      const [hour, minute] = selectedTime.split(":");
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(parseInt(hour), parseInt(minute), 0, 0);
      const paymentData = await appointmentService.createPaymentLink({
        appointmentTime: appointmentDate.toISOString(),
        doctorId: docId,
        initialSymptom,
        amount: docInfo.fees,
        patientId: user.id,
      });
      window.location.href = paymentData.url;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Đặt lịch thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatAction = () => {
    chatService.handleChatAction(
      user,
      docId,
      socket,
      conversationId,
      setConversationId,
      initialSymptom,
      openChat
    );
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
      <BookingModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmBooking}
        docInfo={docInfo}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        initialSymptom={initialSymptom}
        conversationId={conversationId}
        onChatAction={handleChatAction}
        isLoading={isLoading}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <DoctorInfoCard
          docInfo={docInfo}
          conversationId={conversationId}
          onChatAction={handleChatAction}
        />

        <BookingForm
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          initialSymptom={initialSymptom}
          setInitialSymptom={setInitialSymptom}
          availableTimes={availableTimes}
          bookedTimes={bookedTimes}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

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
