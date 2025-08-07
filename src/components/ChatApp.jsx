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

  const handleClearChat = useCallback(() => {
    console.log('[ChatApp] Clear button clicked - calling clearChat');
    clearChat();
    console.log('[ChatApp] clearChat called');
  }, [clearChat]);

  // Escape to close expanded view
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  // Expose methods to parent
  useEffect(() => {
    window.chatInstance = {
      sendMessage,
      clearChat,
      addMessage,
      getMessages: () => messages,
      getThreadId: () => threadId,
      getCurrentRfpId: () => roomId
    };
    
    console.log(`[AI-Chat] Exposed API for RFP: ${roomId}, thread: ${threadId}`);
    
    return () => {
      delete window.chatInstance;
    };
  }, [roomId, messages, sendMessage, clearChat, addMessage, threadId]);

  const messageCount = messages ? messages.length : 0;

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
          onClearChat={handleClearChat}
          messageCount={messageCount}
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