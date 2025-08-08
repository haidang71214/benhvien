import { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { toast } from "react-hot-toast";

export const useConversation = (userId, docId) => {
  const [conversationId, setConversationId] = useState(null);

  useEffect(() => {
    if (!userId || !docId) return;

    const fetchConversation = async () => {
      try {
        const response = await axiosInstance.get(
          `/chat/getAllConversation/${userId}`
        );
        const conversations = Array.isArray(response.data)
          ? response.data
          : [response.data];
        const existing = conversations.find((conv) =>
          conv.participants.some((p) => p?._id === docId)
        );

        if (existing) {
          setConversationId(existing._id);
        } else {
          const newConv = await axiosInstance.post("/chat/checkCC", {
            participants: [userId, docId],
          });
          setConversationId(newConv.data?._id);
        }
      } catch (error) {
        console.error("Error fetching/creating conversation:", error);
        toast.error("Không thể kiểm tra cuộc trò chuyện");
      }
    };

    fetchConversation();
  }, [userId, docId]);

  return [conversationId, setConversationId];
};
