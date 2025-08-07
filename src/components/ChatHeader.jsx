// src/components/ChatHeader.jsx
import React, { useEffect, useState } from 'react';

const ChatHeader = ({ isExpanded, expandable, onToggleExpand, onClearChat, messageCount }) => {
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    setIsInIframe(window.self !== window.top);
  }, []);

  const handleExpandClick = () => {
    if (isInIframe) {
      window.open(window.location.href, '_blank');
    } else {
      onToggleExpand();
    }
  };

  const handleClearClick = () => {
    // Just clear directly without confirmation
    // The button is small enough that accidental clicks are unlikely
    console.log('[ChatHeader] Clear button clicked');
    onClearChat();
  };

  return (
    <div className="chat-header">
      <div className="chat-header-content">
        <div className="chat-title">
          <span className="chat-status-dot"></span>
          <span>AI Chat</span>
          {messageCount > 0 && (
            <span className="chat-message-count">{messageCount}</span>
          )}
        </div>
        <div className="chat-header-actions">
          <button 
            className="chat-clear-btn"
            onClick={handleClearClick}
            title="Clear chat and start new conversation"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"/>
            </svg>
          </button>
          {expandable && (
            <button 
              className="chat-expand-btn"
              onClick={handleExpandClick}
              aria-label={isInIframe ? 'Open in new tab' : (isExpanded ? 'Collapse' : 'Expand')}
              title={isInIframe ? 'Open in new tab' : (isExpanded ? 'Collapse' : 'Expand')}
            >
              {isInIframe ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                </svg>
              ) : isExpanded ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;