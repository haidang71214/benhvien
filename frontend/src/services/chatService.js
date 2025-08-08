import { toast } from "react-hot-toast";
import { appointmentService } from "./appointmentService";

export const chatService = {
  handleChatAction: async (
    user,
    docId,
    socket,
    conversationId,
    setConversationId,
    initialSymptom,
    openChat
  ) => {
    if (!user?.id || !docId || !socket) {
      toast.error("Thiếu dữ liệu để tạo tin nhắn!");
      return;
    }

    try {
      let convId = conversationId;
      if (!convId) {
        const response = await appointmentService.createConversation([
          user.id,
          docId,
        ]);
        if (response?._id) {
          convId = response._id;
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
  },
};
