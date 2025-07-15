import { Server } from "socket.io";
import { saveMessage } from "../controllers/chat.controller.js";

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
      io.emit("chat message", data); // broadcast to all
    });

    socket.on("disconnect", () => {
      console.log("User disconnected: " + socket.id);
    });
  });
}
