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

  // Log threadId changes
  useEffect(() => {
    console.log('[ChatApp] Current threadId:', threadId);
  }, [threadId]);

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

  // Fixed keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Cmd/Ctrl + K anywhere in the chat component
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        // Check if we're focused within the chat component
        const chatContainer = document.querySelector('.chat-container');
        const activeElement = document.activeElement;
        
        // Only clear if focus is within the chat or on the chat input
        if (chatContainer && (chatContainer.contains(activeElement) || activeElement.id === 'chat-input')) {
          e.preventDefault();
          e.stopPropagation();
          console.log('[ChatApp] Cmd/Ctrl+K pressed - clearing chat');
          clearChat();
        }
      }
      
      // Escape to close expanded view
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };
    
    // Add listener to document for better capture
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [clearChat, isExpanded]);

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
    
    console.log(`[ChatApp] Exposed API - RFP: ${roomId}, Thread: ${threadId}`);
    
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