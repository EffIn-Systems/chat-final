// src/components/ChatMessages.jsx
import React, { useEffect, useRef, useState } from 'react';

const ChatMessages = ({ messages, userName, emptyStateMessage, isLoading }) => {
  const messagesEndRef = useRef(null);
  const [showClearNotification, setShowClearNotification] = useState(false);
  const prevMessageCount = useRef(messages?.length || 0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Detect when messages are cleared
  useEffect(() => {
    const currentCount = messages?.length || 0;
    
    // If we had messages and now we don't, show notification
    if (prevMessageCount.current > 0 && currentCount === 0) {
      setShowClearNotification(true);
      
      // Hide notification after 3 seconds
      const timer = setTimeout(() => {
        setShowClearNotification(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
    
    prevMessageCount.current = currentCount;
  }, [messages]);

  return (
    <div className="chat-messages">
      {showClearNotification && (
        <div style={{
          padding: '8px 12px',
          background: 'rgba(74, 222, 128, 0.1)',
          border: '1px solid rgba(74, 222, 128, 0.3)',
          borderRadius: '6px',
          color: '#4ade80',
          fontSize: '12px',
          textAlign: 'center',
          marginBottom: '12px',
          animation: 'messageSlide 0.3s ease-out'
        }}>
          ✓ Chat cleared - Starting new conversation thread
        </div>
      )}
      
      {(!messages || messages.length === 0) ? (
        <div className="chat-empty-state">
          <div className="chat-empty-icon">💬</div>
          <div className="chat-empty-message">{emptyStateMessage}</div>
          {messages && messages.length === 0 && (
            <div style={{ fontSize: '12px', opacity: 0.4, marginTop: '8px' }}>
              New conversation thread created
            </div>
          )}
        </div>
      ) : (
        <>
          {messages.length > 10 && (
            <div style={{
              padding: '6px 12px',
              background: 'rgba(255, 193, 7, 0.1)',
              border: '1px solid rgba(255, 193, 7, 0.2)',
              borderRadius: '6px',
              color: '#ffc107',
              fontSize: '11px',
              textAlign: 'center',
              marginBottom: '12px'
            }}>
              ⚠️ {messages.length} messages in thread - Consider clearing (Cmd/Ctrl+K) for optimal performance
            </div>
          )}
          
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`chat-message ${msg.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'}`}
            >
              <div className="chat-message-content">
                {msg.content}
              </div>
              {msg.timestamp && (
                <div className="chat-message-time">
                  {new Date(msg.timestamp).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="chat-message chat-message-assistant">
              <div className="chat-message-content">
                <div className="chat-typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;