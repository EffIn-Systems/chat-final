// src/hooks/useChat.jsx
import { useState, useCallback, useEffect } from 'react';
import { useStorage, useMutation } from '@liveblocks/react/suspense';

const useChat = ({ webhookUrl, roomId, userId, userName, onMessage, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const messages = useStorage((root) => root.messages);
  const threadId = useStorage((root) => root.threadId);

  // Generate a new thread ID
  const generateThreadId = () => {
    return `${roomId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Initialize threadId if it doesn't exist
  const initializeThreadId = useMutation(({ storage }) => {
    if (!storage.get('threadId')) {
      storage.set('threadId', generateThreadId());
    }
  }, [roomId]);

  // Add message mutation
  const addMessageMutation = useMutation(({ storage }, message) => {
    const messages = storage.get('messages');
    messages.push(message);
    
    // Keep only last 50 messages for performance
    if (messages.length > 50) {
      messages.delete(0);
    }
  }, []);

  // Clear chat and create new thread mutation
  const clearChatMutation = useMutation(({ storage }) => {
    // Clear messages
    storage.get('messages').clear();
    
    // Generate new threadId for fresh context
    const newThreadId = generateThreadId();
    storage.set('threadId', newThreadId);
    
    console.log('[Chat] Cleared messages and created new thread:', newThreadId);
    return newThreadId;
  }, [roomId]);

  // Initialize on mount
  useEffect(() => {
    initializeThreadId();
  }, [initializeThreadId]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const currentThreadId = threadId || generateThreadId();
    
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
      console.log('[Chat] Sending to webhook:', webhookUrl);
      
      // Get only the last 10 messages for context
      const recentMessages = messages ? messages.slice(-10) : [];
      
      const requestBody = {
        message: text,
        userName: userName,
        roomId: roomId,
        threadId: currentThreadId,
        timestamp: userMessage.timestamp,
        history: recentMessages.map(m => ({
          role: m.role,
          content: m.content
        }))
      };
      
      console.log('[Chat] Request body:', requestBody);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('[Chat] Response status:', response.status);
      
      // Get response text first to debug
      const responseText = await response.text();
      console.log('[Chat] Response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('[Chat] Parsed response:', data);
      } catch (parseError) {
        console.error('[Chat] Failed to parse response:', parseError);
        // If response is plain text, use it directly
        data = { response: responseText };
      }
      
      // Try multiple possible response formats
      const assistantContent = 
        data.response || 
        data.message || 
        data.text || 
        data.reply || 
        data.answer ||
        data.content ||
        (typeof data === 'string' ? data : 'No response received');
      
      console.log('[Chat] Assistant content:', assistantContent);
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: assistantContent,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };

      addMessageMutation(assistantMessage);
      
      if (onMessage) {
        onMessage({ 
          userMessage, 
          assistantMessage,
          threadId: currentThreadId
        });
      }
    } catch (error) {
      console.error('[Chat] Detailed error:', error);
      console.error('[Chat] Error stack:', error.stack);
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: `Error: ${error.message}. Check console for details.`,
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
    console.log('[Chat] clearChat called');
    const newThreadId = clearChatMutation();
    console.log('[Chat] Chat cleared - new thread created:', newThreadId);
    return newThreadId;
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