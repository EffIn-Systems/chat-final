import { useState, useCallback, useEffect } from 'react';
import { useStorage, useMutation } from '@liveblocks/react/suspense';

const useChat = ({ webhookUrl, roomId, userId, userName, onMessage, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const messages = useStorage((root) => root.messages);
  const threadId = useStorage((root) => root.threadId) || roomId;

  const addMessageMutation = useMutation(({ storage }, message) => {
    const messages = storage.get('messages');
    messages.push(message);
    
    // Keep only last 50 messages for performance
    if (messages.length > 50) {
      messages.delete(0);
    }
  }, []);

  const clearChatMutation = useMutation(({ storage }) => {
    storage.get('messages').clear();
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: text,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    // Add user message
    addMessageMutation(userMessage);

    // Send to webhook
    setIsLoading(true);
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          userName: userName,
          roomId: roomId,
          threadId: threadId,
          timestamp: userMessage.timestamp,
          history: messages ? messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content
          })) : []
        })
      });

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response || data.message || 'No response',
        role: 'assistant',
        timestamp: new Date().toISOString()
      };

      addMessageMutation(assistantMessage);
      
      if (onMessage) {
        onMessage({ userMessage, assistantMessage });
      }
    } catch (error) {
      console.error('[Chat] Error:', error);
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      
      addMessageMutation(errorMessage);
      
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [webhookUrl, roomId, userName, threadId, messages, addMessageMutation, onMessage, onError]);

  const clearChat = useCallback(() => {
    clearChatMutation();
  }, [clearChatMutation]);

  const addMessage = useCallback((content, role = 'assistant') => {
    const message = {
      id: Date.now().toString(),
      content: content,
      role: role,
      timestamp: new Date().toISOString()
    };
    addMessageMutation(message);
  }, [addMessageMutation]);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    addMessage,
    threadId
  };
};

export default useChat;