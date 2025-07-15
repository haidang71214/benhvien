import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import { axiosInstance } from "../utils/axiosInstance";

const socket = io("http://localhost:8080");

export default function Chat() {
  const [userSearch, setUserSearch] = useState("");
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
    if (!user) return;
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
    <div className="max-w-3xl mx-auto my-8 bg-white shadow-lg rounded-lg flex h-[70vh] border overflow-hidden pt-24">
      {/* Sidebar: User list */}
      <div className="w-56 bg-gray-50 border-r flex flex-col p-4 gap-2">
        <h2 className="font-semibold text-lg mb-2">Users</h2>
        <input
          type="text"
          className="mb-2 px-2 py-1 border rounded text-sm"
          placeholder="Search users..."
          value={userSearch}
          onChange={e => setUserSearch(e.target.value)}
        />
        <div className="flex-1 overflow-y-auto flex flex-col gap-1">
          {users
            .filter(u => {
              const q = userSearch.trim().toLowerCase();
              if (!q) return true;
              return (
                (u.userName && u.userName.toLowerCase().includes(q)) ||
                (u.name && u.name.toLowerCase().includes(q)) ||
                (u.email && u.email.toLowerCase().includes(q))
              );
            })
            .map((u) => (
              <button
                key={u._id || u.id || u.email}
                className={`flex items-center gap-2 w-full px-2 py-2 rounded-lg hover:bg-blue-100 transition text-left ${selectedUser === (u._id || u.id || u.email) ? "bg-blue-200 border border-blue-400" : ""}`}
                onClick={() => setSelectedUser(u._id || u.id || u.email)}
                style={{ outline: "none", border: "none", background: "none" }}
              >
                <img
                  src={u.avatarUrl || "/public/unnamed.png"}
                  alt={u.userName || u.name || u.email}
                  className="w-9 h-9 rounded-full object-cover border"
                />
                <span className="truncate font-medium">{u.userName || u.name || u.email}</span>
              </button>
            ))}
        </div>
      </div>
      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-gray-50 relative">
        <div className="p-4 border-b flex items-center gap-2 bg-white sticky top-0 z-10">
          <h2 className="font-semibold text-lg flex-1">Chat</h2>
          {selectedUser && (
            <span className="text-sm text-gray-500">Chatting with: <span className="font-semibold text-blue-700">{users.find(u => (u._id || u.id || u.email) === selectedUser)?.userName || selectedUser}</span></span>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!selectedUser ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <span className="text-2xl">👈</span>
              <span>Select a user to start chatting</span>
            </div>
          ) : loading ? (
            <div className="text-center text-gray-400">Loading chat...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400">No messages yet.</div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.sender === (user?._id || user?.id || user?.email);
              const senderUser = isMe
                ? user
                : users.find((u) => (u._id || u.id || u.email) === msg.sender);
              return (
                <div
                  key={idx}
                  className={`w-full flex ${isMe ? "justify-end" : "justify-start"} mb-4`}
                >
                  {/* Receiver message: avatar left, bubble right */}
                  {!isMe ? (
                    <div className="flex items-end gap-2">
                      <img
                        src={senderUser?.avatarUrl || "/public/unnamed.png"}
                        alt={senderUser?.userName || senderUser?.name || senderUser?.email}
                        className="w-8 h-8 rounded-full object-cover border"
                        style={{alignSelf: 'flex-end'}}
                      />
                      <div className="max-w-[70%] px-3 py-2 rounded-xl bg-blue-50 text-gray-900 text-base leading-snug" style={{borderRadius: '16px 16px 16px 4px'}}>
                        {msg.message}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-row items-end gap-2 justify-end w-full">
                      <div
                        className="max-w-[70%] px-3 py-2 rounded-xl bg-blue-400 text-white text-base leading-snug text-right"
                        style={{ borderRadius: '16px 16px 4px 16px', marginLeft: 'auto' }}
                      >
                        {msg.message}
                      </div>
                      <img
                        src={user.avatarUrl || "/public/unnamed.png"}
                        alt={user.userName || user.name || user.email}
                        className="w-8 h-8 rounded-full object-cover border"
                        style={{ alignSelf: 'flex-end' }}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="flex p-2 border-t bg-white sticky bottom-0 z-10">
          <input
            className="flex-1 border rounded px-2 py-1 mr-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={!selectedUser}
          />
          <button className="bg-blue-500 text-white px-4 py-1 rounded" type="submit" disabled={!selectedUser}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
