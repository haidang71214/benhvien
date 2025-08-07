'use client';

import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [docId, setCurrentLawyerId] = useState(null);

  const openChat = (conversationId, docId) => {
    setCurrentConversationId(conversationId);
    setCurrentLawyerId(docId);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setCurrentConversationId(null);
    setCurrentLawyerId(null);
  };

  return (
    <ChatContext.Provider value={{ openChat, closeChat, isChatOpen, currentConversationId, docId }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
