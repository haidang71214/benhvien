
import express from 'express';
import { getChatHistory } from '../controllers/chat.controller.js';
const router = express.Router();

// GET /api/v1/chat/history?user1=...&user2=...
router.get('/history', async (req, res) => {
  const { user1, user2 } = req.query;
  if (!user1 || !user2) return res.status(400).json({ message: 'Missing user1 or user2' });
  try {
    const history = await getChatHistory(user1, user2);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching chat history' });
  }
});

export default router;
