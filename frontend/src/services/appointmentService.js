import { axiosInstance } from "../utils/axiosInstance";

export const appointmentService = {
  createPaymentLink: async (appointmentData) => {    
    const response = await axiosInstance.post(
      "/payment/create-payment-link",
      appointmentData
    );
    return response.data;
  },

  createConversation: async (participants) => {
    const response = await axiosInstance.post("/chat/createConversation", {
      participants,
    });
    return response.data;
  },
};
