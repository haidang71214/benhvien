import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import { axiosInstance, BASE_URL } from "../utils/axiosInstance";

const socket = io(`${BASE_URL}`);

export default function Chat() {
  const [userSearch, setUserSearch] = useState("");
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const loadUsers = async () => {
      try {
        const res = await axiosInstance.get("/admin/getAllUsers");
        const filtered = (res?.data?.data || []).filter(
          (u) => (u._id || u.id || u.email) !== (user._id || user.id || user.email)
        );
        setUsers(filtered);
        if (filtered.length > 0) {
          setSelectedUser(filtered[0]._id || filtered[0].id || filtered[0].email);
        }
      } catch (error) {
        setUsers([]);
        setSelectedUser("");
        console.error("Failed to load users:", error);
      }
    };

    loadUsers();
  }, [user]);

  useEffect(() => {
    const handleChatMessage = (data) => {
      if (
        (data.sender === (user?._id || user?.id || user?.email) &&
          data.receiver === selectedUser) ||
        (data.sender === selectedUser &&
          data.receiver === (user?._id || user?.id || user?.email))
      ) {
        setMessages((prev) => [...prev, data]);
        setTimeout(scrollToBottom, 100);
      }
    };

    socket.on("chat message", handleChatMessage);
    return () => socket.off("chat message");
  }, [selectedUser, user, scrollToBottom]);

  useEffect(() => {
    if (!user || !selectedUser) return;
    
    const loadHistory = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/chat/history?user1=${encodeURIComponent(
            user._id || user.id || user.email
          )}&user2=${encodeURIComponent(selectedUser)}`
        );
        setMessages(res.data || []);
        setTimeout(scrollToBottom, 100);
      } catch (error) {
        setMessages([]);
        console.error("Failed to load chat history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [selectedUser, user, scrollToBottom]);

  const sendMessage = useCallback((e) => {
    e.preventDefault();
    if (!input.trim() || !user || !selectedUser) return;
    
    socket.emit("chat message", {
      sender: user._id || user.id || user.email || "unknown",
      receiver: selectedUser,
      message: input.trim(),
    });
    setInput("");
  }, [input, user, selectedUser]);

  const filteredUsers = users.filter((u) => {
    if (!userSearch.trim()) return true;
    const query = userSearch.trim().toLowerCase();
    return (
      (u.userName && u.userName.toLowerCase().includes(query)) ||
      (u.name && u.name.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query))
    );
  });

  const selectedUserInfo = users.find(
    (u) => (u._id || u.id || u.email) === selectedUser
  );

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <div className="bg-white p-8 rounded-2xl shadow-lg border">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">Welcome to Chat</h2>
          <p className="text-gray-600 text-center">Please log in to start chatting with others.</p>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <div className="bg-white p-8 rounded-2xl shadow-lg border">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">No Users Found</h2>
          <p className="text-gray-600 text-center">There are no other users available to chat with at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-20 mb-8 bg-white rounded-2xl shadow-2xl flex h-[85vh] border border-gray-100 overflow-hidden">
      <div className="w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
              </svg>
            </div>
            Messages
          </h2>
          <div className="relative">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
              placeholder="Search conversations..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          <div className="space-y-1">
            {filteredUsers.map((u) => {
              const isSelected = selectedUser === (u._id || u.id || u.email);
              return (
                <button
                  key={u._id || u.id || u.email}
                  onClick={() => setSelectedUser(u._id || u.id || u.email)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-gray-100 ${
                    isSelected
                      ? "bg-blue-50 border border-blue-200 shadow-sm"
                      : "hover:shadow-sm"
                  }`}
                >
                  <div className="relative">
                    <img
                      src={u.avatarUrl || "/public/unnamed.png"}
                      alt={u.userName || u.name || u.email}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {u.userName || u.name || u.email}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {u.email || "Online"}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            {selectedUserInfo && (
              <>
                <img
                  src={selectedUserInfo.avatarUrl || "/public/unnamed.png"}
                  alt={selectedUserInfo.userName || selectedUserInfo.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <h3 className="font-bold text-gray-900">
                    {selectedUserInfo.userName || selectedUserInfo.name || selectedUserInfo.email}
                  </h3>
                  <p className="text-sm text-green-500 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Online
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="flex items-center gap-3 text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span>Loading messages...</span>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
              <p className="text-center">Start the conversation by sending a message!</p>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => {
                const isMe = msg.sender === (user._id || user.id || user.email);
                const senderUser = isMe
                  ? user
                  : users.find((u) => (u._id || u.id || u.email) === msg.sender);
                
                return (
                  <div
                    key={idx}
                    className={`flex ${isMe ? "justify-end" : "justify-start"} w-full`}
                  >
                    <div
                      className={`flex items-end gap-3 max-w-[70%] ${
                        isMe ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <img
                        src={
                          (isMe ? user.avatarUrl : senderUser?.avatarUrl) ||
                          "/public/unnamed.png"
                        }
                        alt={
                          (isMe ? user.userName : senderUser?.userName) || "User"
                        }
                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                      />
                      <div
                        className={`px-6 py-3 rounded-2xl shadow-sm text-sm whitespace-pre-wrap max-w-full break-words ${
                          isMe
                            ? "bg-blue-500 text-white rounded-br-md"
                            : "bg-white text-gray-800 rounded-bl-md border border-gray-200"
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-white">
          <form onSubmit={sendMessage} className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all bg-gray-50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                disabled={!selectedUser}
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(e);
                  }
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!selectedUser || !input.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-2xl transition-all shadow-sm hover:shadow-md flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}