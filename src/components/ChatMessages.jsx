import React, { useEffect, useRef } from 'react';

const ChatMessages = ({ messages, userName, emptyStateMessage, isLoading }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-messages">
      {(!messages || messages.length === 0) ? (
        <div className="chat-empty-state">
          <div className="chat-empty-icon">💬</div>
          <div className="chat-empty-message">{emptyStateMessage}</div>
        </div>
      ) : (
        <>
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