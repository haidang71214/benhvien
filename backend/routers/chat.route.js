
import express from 'express';
import { getChatHistory } from '../controllers/chat.controller.js';
const chatRouter = express.Router();
import { checkCoddddddnversation, createConversation, getConversation, getMessage, sendMessage } from "../controllers/l.controller.js";

// GET /api/v1/chat/history?user1=...&user2=...
chatRouter.get('/history', async (req, res) => {
  const { user1, user2 } = req.query;
  if (!user1 || !user2) return res.status(400).json({ message: 'Missing user1 or user2' });
  try {
    const history = await getChatHistory(user1, user2);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching chat history' });
  }
});

// kh động vô cái dưới, cái trên k ổn
chatRouter.post('/createConversation',createConversation)
chatRouter.get('/getAllConversation/:userId',getConversation)
chatRouter.post('/sendMessage',sendMessage)
chatRouter.get('/getMessage/:conversationId',getMessage)
// công dụng của cái dưới là check cái conversation đó có chưa, 
// nếu chưa có thì phần sau hắn sẽ tạo mới conversation, còn nếu có rồi thì hắn sẽ tự vào tạo mới hội thoại
// nhưng cái api đầu tiên đảm bảo phần đó rồi, nên không cần lắm, nào khó xử lí cái trên thì lấy cái dưới cho linh hoạt cũng được
chatRouter.post('/checkCC',checkCoddddddnversation)
export default chatRouter;
