// src/Chat.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStorage, useMutation, useOthers, useMyPresence } from '@liveblocks/react/suspense';
import { format } from 'date-fns';

function Chat({ userName, roomId }) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const messages = useStorage((root) => root.messages);
  const others = useOthers();
  const [myPresence, updateMyPresence] = useMyPresence();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle typing indicator
  const handleTypingStart = useCallback(() => {
    if (!myPresence?.isTyping) {
      updateMyPresence({ isTyping: true });
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      updateMyPresence({ isTyping: false });
    }, 1000);
  }, [myPresence, updateMyPresence]);

  // Mutation to add a message
  const addMessage = useMutation(({ storage }, text, userName) => {
    const messages = storage.get('messages');
    const newMessage = {
      id: Date.now().toString(),
      text: text,
      userName: userName,
      timestamp: new Date().toISOString(),
      roomId: roomId
    };
    
    messages.push(newMessage);
    
    // Keep only last 100 messages
    if (messages.length > 100) {
      messages.delete(0);
    }
  }, [roomId]);

  // Mutation to clear messages
  const clearMessages = useMutation(({ storage }) => {
    storage.get('messages').clear();
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    addMessage(message, userName);
    setMessage('');
    
    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    updateMyPresence({ isTyping: false });
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    handleTypingStart();
  };

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + K to clear
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      clearMessages();
    }
  };

  // Get typing users
  const typingUsers = others
    .filter(user => user.presence?.isTyping && user.presence?.name !== userName)
    .map(user => user.presence?.name || 'Someone');

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-title">
          <span className="room-name">Room: {roomId}</span>
          <span className="user-count">{others.count + 1} users online</span>
        </div>
        <button 
          className="clear-button"
          onClick={clearMessages}
          title="Clear chat (Ctrl+K)"
        >
          Clear
        </button>
      </div>

      <div className="messages-container">
        {(!messages || messages.length === 0) ? (
          <div className="empty-state">
            <div className="empty-message">No messages yet</div>
            <div className="empty-hint">Be the first to say hello!</div>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`message ${msg.userName === userName ? 'own-message' : 'other-message'}`}
            >
              <div className="message-header">
                <span className="message-user">{msg.userName}</span>
                <span className="message-time">
                  {format(new Date(msg.timestamp), 'HH:mm')}
                </span>
              </div>
              <div className="message-text">{msg.text}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          {typingUsers.length === 1 
            ? `${typingUsers[0]} is typing...`
            : `${typingUsers.join(', ')} are typing...`
          }
        </div>
      )}

      <form className="input-container" onSubmit={handleSendMessage}>
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="message-input"
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!message.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;