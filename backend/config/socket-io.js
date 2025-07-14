import { Server } from 'socket.io';
import { conversations, messages } from '../model/messageSchema.js';

export function setupSocketIo(server) {
  const io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);

      messages
        .find({ conversation: roomId })
        .sort({ createdAt: 1 })
        .then((messages) => socket.emit('messageHistory', messages))
        .catch((error) => console.error('Error fetching messages:', error));
    });

    socket.on('sendMessage', async ({ conversationId, senderId, content }) => {
      try {
        const newMessage = await messages.create({
          conversation: conversationId,
          content,
          sender: senderId,
          readBy: [senderId],
        });
        io.to(conversationId).emit('newMessage', newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}