import { useEffect, useRef, useState } from "react";

export const ChatWindow = ({ socket, conversationId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
useEffect(() => {
  scrollToBottom();
}, [messages,newMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!conversationId) return;

    socket.emit('joinRoom', conversationId);

    socket.on('messageHistory', (history) => {
      setMessages(history);
      scrollToBottom();
    });

    socket.on('newMessage', (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      socket.off('messageHistory');
      socket.off('newMessage');
      socket.off('error');
    };
  }, [conversationId, socket]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    socket.emit('sendMessage', {
      conversationId,
      senderId: userId,
      content: newMessage,
    });
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '320px',
        width: '400px',
        height: '500px',
        backgroundColor: '#1a202c',
        color: '#e2e8f0',
        border: '1px solid #4a5568',
        borderRadius: '8px',
        boxShadow: '-5px 0 10px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '10px',
          borderBottom: '1px solid #4a5568',
          fontSize: '1.25rem',
          fontWeight: '600',
        }}
      >
        Chat với bác sĩ 
      </div>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px',
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              margin: '10px 0',
              textAlign: msg.sender === userId ? 'right' : 'left',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: msg.sender === userId ? '#3182ce' : '#4a5568',
                color: '#e2e8f0',
                maxWidth: '70%',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div
        style={{
          padding: '10px',
          borderTop: '1px solid #4a5568',
          display: 'flex',
          gap: '10px',
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tin nhắn..."
          style={{
            flex: 1,
            padding: '8px',
            border: '1px solid #4a5568',
            borderRadius: '5px',
            backgroundColor: '#2d3748',
            color: '#e2e8f0',
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: '8px 16px',
            border: '1px solid #4a5568',
            borderRadius: '5px',
            backgroundColor: '#3182ce',
            color: '#e2e8f0',
            cursor: 'pointer',
          }}
        >
          Gửi
        </button>
      </div>
    </div>
  );
};