// src/components/ChatApp.jsx
import React, { useState, useEffect, useCallback } from 'react';
import ChatHeader from './ChatHeader.jsx';
import ChatMessages from './ChatMessages.jsx';
import ChatInput from './ChatInput.jsx';
import useChat from '../hooks/useChat.jsx';
import { injectChatStyles } from '../styles/chatStyles.js';

const ChatApp = ({
  webhookUrl,
  roomId,
  userId,
  userName,
  placeholder,
  emptyStateMessage,
  expandable,
  theme = 'dark',
  onMessage,
  onError,
  onReady
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    injectChatStyles();
  }, []);
  
  const {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    addMessage,
    threadId
  } = useChat({
    webhookUrl,
    roomId,
    userId,
    userName,
    onMessage,
    onError
  });

  useEffect(() => {
    if (onReady) {
      onReady();
    }
    
    const handleApiMessage = (event) => {
      if (event.detail && event.detail.roomId === roomId) {
        if (event.detail.message) {
          sendMessage(event.detail.message);
        }
      }
    };
    
    window.addEventListener('chat-api-message', handleApiMessage);
    return () => {
      window.removeEventListener('chat-api-message', handleApiMessage);
    };
  }, [roomId, sendMessage, onReady]);

  const handleToggleExpand = useCallback(() => {
    if (expandable) {
      setIsExpanded(!isExpanded);
    }
  }, [isExpanded, expandable]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k' && e.target.id === 'chat-input') {
        e.preventDefault();
        clearChat();
      }
      
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearChat, isExpanded]);

  useEffect(() => {
    window.chatInstance = {
      sendMessage,
      clearChat,
      addMessage,
      getMessages: () => messages,
      getThreadId: () => threadId,
      getCurrentRfpId: () => roomId
    };
    
    return () => {
      delete window.chatInstance;
    };
  }, [roomId, messages, sendMessage, clearChat, addMessage, threadId]);

  return (
    <>
      {isExpanded && expandable && (
        <div className="chat-overlay" onClick={handleToggleExpand} />
      )}
      <div className={`chat-container chat-theme-${theme} ${isExpanded ? 'expanded' : ''}`}>
        <ChatHeader 
          isExpanded={isExpanded}
          expandable={expandable}
          onToggleExpand={handleToggleExpand}
        />
        <ChatMessages 
          messages={messages}
          userName={userName}
          emptyStateMessage={emptyStateMessage}
          isLoading={isLoading}
        />
        <ChatInput
          onSendMessage={sendMessage}
          isLoading={isLoading}
          placeholder={placeholder}
        />
      </div>
    </>
  );
};

export default ChatApp;