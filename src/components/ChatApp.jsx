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

  // Log webhook URL and threadId
  useEffect(() => {
    console.log('[ChatApp] Initialized with:');
    console.log('  - Webhook URL:', webhookUrl);
    console.log('  - Room ID:', roomId);
    console.log('  - Thread ID:', threadId);
    console.log('  - User:', userName);
  }, [webhookUrl, roomId, threadId, userName]);

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

  // Global keyboard handler as backup
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Only handle Escape here for expansion
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };
    
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isExpanded]);

  // Handle clear from input or keyboard
  const handleClearChat = useCallback(() => {
    console.log('[ChatApp] Clear chat triggered');
    clearChat();
  }, [clearChat]);

  // Expose methods to parent
  useEffect(() => {
    window.chatInstance = {
      sendMessage,
      clearChat: handleClearChat,
      addMessage,
      getMessages: () => messages,
      getThreadId: () => threadId,
      getCurrentRfpId: () => roomId
    };
    
    return () => {
      delete window.chatInstance;
    };
  }, [roomId, messages, sendMessage, handleClearChat, addMessage, threadId]);

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
          onClearChat={handleClearChat}
          isLoading={isLoading}
          placeholder={placeholder}
        />
      </div>
    </>
  );
};

export default ChatApp;