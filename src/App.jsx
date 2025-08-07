// src/App.jsx
import React, { useState, useEffect } from 'react';
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from '@liveblocks/react/suspense';
import ChatApp from './components/ChatApp.jsx';
import './index.css';

const publicKey = import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY;

function App() {
  const [config, setConfig] = useState({
    roomId: '',
    userName: '',
    webhookUrl: '',
    placeholder: '',
    emptyStateMessage: '',
    expandable: true,
    theme: 'dark'
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    setConfig({
      roomId: params.get('roomId') || 'default-room',
      userName: params.get('userName') || 'User',
      webhookUrl: params.get('webhookUrl') || 'https://hook.us2.make.com/default',
      placeholder: params.get('placeholder') || 'Type or paste your message…',
      emptyStateMessage: params.get('emptyStateMessage') || 'How can I help?',
      expandable: params.get('expandable') !== 'false',
      theme: params.get('theme') || 'dark'
    });
    
    if (publicKey) {
      setIsReady(true);
    }
  }, []);

  if (!isReady || !config.roomId) {
    return <div className="loading-container">Initializing...</div>;
  }

  // Generate initial threadId
  const initialThreadId = `${config.roomId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <LiveblocksProvider publicApiKey={publicKey}>
      <RoomProvider 
        id={config.roomId}
        initialStorage={{ 
          messages: [],
          threadId: initialThreadId  // Initialize with a threadId
        }}
      >
        <ClientSideSuspense fallback={<div>Loading...</div>}>
          <ChatApp
            webhookUrl={config.webhookUrl}
            roomId={config.roomId}
            userId={config.userName}
            userName={config.userName}
            placeholder={config.placeholder}
            emptyStateMessage={config.emptyStateMessage}
            expandable={config.expandable}
            theme={config.theme}
          />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

export default App;