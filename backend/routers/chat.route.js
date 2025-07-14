// :v
import express from "express";
import { checkCoddddddnversation, createConversation, getConversation, getMessage, sendMessage } from "../controllers/chat.controller.js";


const chatRouter = express.Router();
// tạo conversation mới, hoặc lấy conversation cũ
chatRouter.post('/createConversation',createConversation)
chatRouter.get('/getAllConversation/:userId',getConversation)
chatRouter.post('/sendMessage',sendMessage)
chatRouter.get('/getMessage/:conversationId',getMessage)
// công dụng của cái dưới là check cái conversation đó có chưa, 
// nếu chưa có thì phần sau hắn sẽ tạo mới conversation, còn nếu có rồi thì hắn sẽ tự vào tạo mới hội thoại
// nhưng cái api đầu tiên đảm bảo phần đó rồi, nên không cần lắm, nào khó xử lí cái trên thì lấy cái dưới cho linh hoạt cũng được
chatRouter.get('/checkCC',checkCoddddddnversation)

// Route mới cho admin

export default chatRouter