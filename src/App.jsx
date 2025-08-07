// src/App.jsx - FIXED VERSION WITHOUT LIVEBLOCKS FOR MESSAGES
import React, { useState, useEffect } from 'react';
import ChatApp from './components/ChatApp.jsx';
import './index.css';

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
      webhookUrl: params.get('webhookUrl') || 'https://hook.eu2.make.com/nc52vwwe7ckhc303a8pvle9dp7ve7p2d',
      placeholder: params.get('placeholder') || 'Type or paste your message…',
      emptyStateMessage: params.get('emptyStateMessage') || 'How can I help?',
      expandable: params.get('expandable') !== 'false',
      theme: params.get('theme') || 'dark'
    });
    
    setIsReady(true);
  }, []);

  if (!isReady || !config.roomId) {
    return <div className="loading-container">Initializing...</div>;
  }

  return (
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
  );
}

export default App;