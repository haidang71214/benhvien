'use client';
import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../utils/axiosInstance';
import { useAuth } from './AuthContext';

export default function SliderChatUser({ onClose, onSelectConversation }) {
  const [conversations, setConversations] = useState([]);
  console.log(conversations);
  
  const [userId, setUserId] = useState(null);
      const { user } = useAuth();
  useEffect(() => {
    if (user) {
      console.log(user);
      
      try {
 
        
        const fetchedUserId = user.id;
        setUserId(fetchedUserId);
        console.log('User ID from localStorage:', fetchedUserId);

        const fetchConversations = async () => {
          try {
            const response = await axiosInstance.get(`/chat/getAllConversation/${fetchedUserId}`);
            console.log('Conversations API Response:', response.data.map((item, index) => ({
              index,
              id: item._id,
            })));

            const data = Array.isArray(response.data) ? response.data : [response.data];
            const mappedData = data.map((item) => ({
              id: item._id,
              participants: item.participants,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            }));
            setConversations(mappedData);
          } catch (error) {
            console.error('Error fetching conversations:', error.response ? error.response.data : error.message);
          }
        };

        fetchConversations();
      } catch (error) {
        console.error('Error parsing USER_PROFILE from localStorage:', error);
      }
    } else {
      console.error('No USER_PROFILE found in localStorage');
    }
  }, []);

  const handleConversationClick = (conversationId) => {
    onSelectConversation(conversationId);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: 0,
      width: '300px',
      height: 'calc(100vh - 80px)',
      padding: '20px',
      backgroundColor: '#1a202c',
      color: '#e2e8f0',
      borderLeft: '1px solid #4a5568',
      boxShadow: '-5px 0 10px rgba(0, 0, 0, 0.3)',
      zIndex: 1000,
      overflowY: 'auto',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #4a5568', paddingBottom: '10px' }}>
        <h3 style={{ color: '#e2e8f0', fontSize: '1.25rem', fontWeight: '600' }}>Các cuộc hội thoại</h3>
        <button
          onClick={onClose}
          style={{
            padding: '5px 10px',
            border: '1px solid #4a5568',
            borderRadius: '5px',
            backgroundColor: '#2d3748',
            color: '#e2e8f0',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4a5568'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2d3748'}
        >
          Đóng
        </button>
      </div>

      {userId ? (
        conversations.length > 0 ? (
          <ul style={{ padding: 0, marginTop: '15px' }}>
            {conversations.map((conversation, index) => (
              <li key={index} style={{ margin: '10px 0' }}>
                <div
                  style={{
                    padding: '10px',
                    border: '1px solid #4a5568',
                    borderRadius: '5px',
                    backgroundColor: '#2d3748',
                    color: '#e2e8f0',
                    transition: 'background-color 0.2s',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleConversationClick(conversation.id)}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4a5568'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2d3748'}
                >
                  <strong style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500' }}>
                    Mã hội thoại: {conversation.id}
                  </strong>
                  <div style={{ fontSize: '0.75rem', color: '#a0aec0', marginTop: '5px' }}>
                    Thành viên: {conversation.participants.map((item, i) => (
                      <div key={i} style={{ marginBottom: '5px' }}>
                        {item.userName} ({item.role})
                      </div>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#a0aec0', marginTop: '15px' }}>Không có cuộc hội thoại nào.</p>
        )
      ) : (
        <p style={{ color: '#a0aec0', marginTop: '15px' }}>Vui lòng đăng nhập để xem các cuộc hội thoại.</p>
      )}
    </div>
  );
}
