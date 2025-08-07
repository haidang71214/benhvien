"use client";
import { useEffect, useState, createContext } from "react";
import { io } from "socket.io-client";
import { BASE_URL, SOCKET_URL } from "../utils/axiosInstance";

export const SocketContext = createContext({
  socket: undefined,
});

export default function SocketProvider({ children }) {
  const [socket, setSocket] = useState();
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      setSocket(newSocket);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    return () => {
      newSocket.disconnect();
      console.log("❎ Socket disconnected");
    };
  }, []);
useEffect(() => {
  if (socket) {
    // socket.on("dashboard-joined", ...) <-- BỎ
    // socket.emit("join-dashboard"); <-- BỎ
    setJoined(true); // Luôn luôn set true khi socket đã kết nối

    return () => {
      // socket.off("dashboard-joined"); <-- BỎ
    };
  }
}, [socket]);


  return (
    <SocketContext.Provider value={{ socket }}>
      {joined ? children : <p>🔌 Đang kết nối tới dashboard...</p>}
    </SocketContext.Provider>
  );
}
