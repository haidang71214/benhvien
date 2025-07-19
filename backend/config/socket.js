import { Server } from "socket.io";
import { saveMessage } from "../controllers/chat.controller.js";
import { sendNotification } from "../controllers/notification.controller.js";
import { users } from "../model/user.js";

export default function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);

    socket.on("chat message", async (data) => {
      // data: { sender, receiver, message }
      await saveMessage(data);
      // Fetch sender's userName
      let senderName = "Someone";
      try {
        const senderUser = await users.findById(data.sender);
        if (senderUser) senderName = senderUser.userName;
      } catch {}
      // Create notification for receiver
      await sendNotification(
        data.receiver,
        `New message from ${senderName}`,
        null,
        'chat'
      );
      io.emit("chat message", data); // broadcast to all
    });

    socket.on("disconnect", () => {
      console.log("User disconnected: " + socket.id);
    });
  });
}
