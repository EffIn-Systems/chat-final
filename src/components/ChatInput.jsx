// src/components/ChatInput.jsx
import React, { useState, useRef } from 'react';

const ChatInput = ({ onSendMessage, isLoading, placeholder }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    // Shift+Enter for new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-input-wrapper">
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          id="chat-input"
          className="chat-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows="1"
        />
        <button 
          type="submit" 
          className="chat-send-btn"
          disabled={!message.trim() || isLoading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>
      <div className="chat-input-guidance">
        <div className="chat-guidance-row">
          <span>Shift+Enter for new line</span>
          <span className="chat-guidance-separator">•</span>
          <span>Cmd/Ctrl+K to clear</span>
        </div>
        <div className="chat-guidance-row">
          <span>Clear after ≈10 messages for optimal performance</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;