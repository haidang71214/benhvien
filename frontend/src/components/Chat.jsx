import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import { axiosInstance } from "../utils/axiosInstance";

const socket = io("http://localhost:8080");

export default function Chat() {
  console.log('Chat component mounted');
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);



  // If not logged in, show message in page
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <h2 className="text-2xl font-semibold mb-4">Chat</h2>
        <p>Please log in to use chat.</p>
      </div>
    );
  }

  // fallback: always render something for debugging
  if (!user && users.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-red-500">
        <h2 className="text-2xl font-semibold mb-4">Chat Fallback</h2>
        <p>Component is mounted but no user and no users loaded.</p>
      </div>
    );
  }
  // Fetch all users for chat selection
  useEffect(() => {
    if (!user || !user?.accessToken) return;
    axiosInstance
      .get("/api/v1/user/getAllUsers")
      .then((res) => {
        // Exclude self from user list
        let usersArr = [];
        if (res && res.data && Array.isArray(res.data.data)) {
          usersArr = res.data.data;
        }
        const filtered = usersArr.filter(
          (u) => (u._id || u.id || u.email) !== (user?._id || user?.id || user?.email)
        );
        setUsers(filtered);
        if (filtered.length > 0) setSelectedUser(filtered[0]._id || filtered[0].id || filtered[0].email);
      })
      .catch(() => setUsers([]));
    // eslint-disable-next-line
  }, [user]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("chat message", (data) => {
      // Only add messages for this chat
      if (
        (data.sender === (user?._id || user?.id || user?.email) && data.receiver === selectedUser) ||
        (data.sender === selectedUser && data.receiver === (user?._id || user?.id || user?.email))
      ) {
        setMessages((prev) => [...prev, data]);
      }
    });
    return () => {
      socket.off("chat message");
    };
    // eslint-disable-next-line
  }, [selectedUser, user]);

  // Load chat history when selectedUser changes
  useEffect(() => {
    if (!user || !selectedUser) return;
    setLoading(true);
    axiosInstance
      .get(
        `/api/v1/chat/history?user1=${encodeURIComponent(
          user?._id || user?.id || user?.email
        )}&user2=${encodeURIComponent(selectedUser)}`
      )
      .then((res) => {
        setMessages(res.data || []);
      })
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [selectedUser, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !user || !selectedUser) return;
    socket.emit("chat message", {
      sender: user?._id || user?.id || user?.email || "unknown",
      receiver: selectedUser,
      message: input,
    });
    setInput("");
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <h2 className="text-2xl font-semibold mb-4">Chat</h2>
        <p>No other users available to chat with.</p>
      </div>
    );
  }

  // Main chat UI
  return (
    <div className="max-w-lg mx-auto my-8 bg-white shadow-lg rounded-lg flex flex-col h-[70vh] border">
      <div className="p-4 border-b flex items-center gap-2">
        <h2 className="font-semibold text-lg flex-1">Chat</h2>
        <span className="font-semibold">Chat with:</span>
        <select
          className="border rounded px-2 py-1 flex-1"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          disabled={users.length === 0}
        >
          {users.map((u) => (
            <option key={u._id || u.id || u.email} value={u._id || u.id || u.email}>
              {u.userName || u.name || u.email}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center text-gray-400">Loading chat...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400">No messages yet.</div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 ${
                msg.sender === (user?._id || user?.id || user?.email)
                  ? "text-blue-600 text-right"
                  : "text-gray-800 text-left"
              }`}
            >
              <span className="font-bold">
                {msg.sender === (user?._id || user?.id || user?.email)
                  ? "You"
                  : users.find((u) => (u._id || u.id || u.email) === msg.sender)?.userName || msg.sender}
                :
              </span>
              <span>{msg.message}</span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex p-2 border-t">
        <input
          className="flex-1 border rounded px-2 py-1 mr-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="bg-blue-500 text-white px-4 py-1 rounded" type="submit" disabled={!selectedUser}>
          Send
        </button>
      </form>
    </div>
  );
}
