import { conversations, messages } from "../model/messageSchema.js"

// tạo conversation mới
const createConversation = async(req,res) =>{
   try {
      // participants là 1 mảng id, m làm nhớ để ý
      // này là check xem đã có hội thoại giữa 2 người chưa
      const {participants} = req.body
      const existing = await conversations.findOne({
         participants: { $all: participants, $size: participants.length },
         isGroup: false,
       });
       if (existing) return existing;

      const response = await conversations.create({
         participants
      })
      return res.status(200).json(response)
   } catch (error) {
      throw new Error(error)
   }
}


// lấy hết hội thoại của ai đó 
const getConversation = async(req,res)=>{
try {
   const {userId} = req.params;
   // chỗ này nó sẽ lấy toàn bộ hội thoại của thằng user đó
   const response = await conversations.find({participants:userId}).populate('participants')
   return res.status(200).json(response)
} catch (error) {
   throw new Error(error)
}
}
// gửi tin nhắn
const sendMessage = async(req,res) =>{
   try {
      const {conversationId,content,senderId} = req.body
      const newMessage = await messages.create({
         conversation:conversationId,
         content,
         sender:senderId,
         readBy: [senderId], // kệ mẹ cái readby đi,nào lỗi kêu t =))
      })
      return res.status(200).json(newMessage)
   } catch (error) {
      throw new Error(error)
   }
}
// cái cục này là lấy tin nhắn
const getMessage = async(req,res) =>{
   try {
      const {conversationId} = req.params
      // t có sort ở sau mà kh nhớ express có hỗ trợ không ấy
      const messageData = await messages.find({conversation:conversationId}).sort({createdAt:1})
      return res.status(200).json(messageData)
   } catch (error) {
      throw new Error(error)
   }
}
// cái ở dưới chỉ là cái check xem đã nhắn chưa hay không thôi
// cái api đầu tiên t đã check rồi nên cái ở dưới không cần nữa đâu =)), thích thì lấy cái ở dưới check nếu ở trên khó xử lí quá
const checkCoddddddnversation = async(req,res) =>{
   try {
      const {clientId,doctorId} = req.body;
      const conversation = await conversations.findOne({
         participants:[clientId,doctorId]
      }).populate('participants').exec();
      return res.status(200).json(conversation)
   } catch (error) {
      throw new Error(error);
   }
}

// Lấy tất cả conversations cho Admin
const getAllConversationsForAdmin = async (req, res) => {
    try {
        const allConversations = await conversations.find({}).populate('participants', 'name email role').sort({ updatedAt: -1 });
        return res.status(200).json(allConversations);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi lấy cuộc trò chuyện." });
    }
};

export {createConversation,getConversation,sendMessage,getMessage,checkCoddddddnversation, getAllConversationsForAdmin}