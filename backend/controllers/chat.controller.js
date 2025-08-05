
import ChatMessage from '../model/chatMessage.js';


// Save message to DB
export async function saveMessage(data) {
  const { sender, receiver, message } = data;
  const chatMessage = new ChatMessage({ sender, receiver, message });
  return await chatMessage.save();
}

// Get chat history between two users
export async function getChatHistory(user1, user2) {
  return await ChatMessage.find({
    $or: [
      { sender: user1, receiver: user2 },
      { sender: user2, receiver: user1 }
    ]
  }).sort({ createdAt: 1 });
}
