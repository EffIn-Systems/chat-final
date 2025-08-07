// src/components/ChatHeader.jsx
import React, { useEffect, useState } from 'react';

const ChatHeader = ({ isExpanded, expandable, onToggleExpand }) => {
  const [isInIframe, setIsInIframe] = useState(false);
  const [localExpanded, setLocalExpanded] = useState(false);

  useEffect(() => {
    // Detect if we're in an iframe
    setIsInIframe(window.self !== window.top);
  }, []);

  const handleExpandClick = () => {
    if (isInIframe) {
      // Send message to parent to toggle fullscreen
      const newExpandedState = !localExpanded;
      setLocalExpanded(newExpandedState);
      
      window.parent.postMessage({ 
        type: 'chat-toggle-fullscreen',
        expanded: newExpandedState
      }, '*');
    } else {
      // Normal expand if not in iframe
      onToggleExpand();
    }
  };

  // Listen for escape key to close fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && localExpanded && isInIframe) {
        setLocalExpanded(false);
        window.parent.postMessage({ 
          type: 'chat-toggle-fullscreen',
          expanded: false
        }, '*');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [localExpanded, isInIframe]);

  return (
    <div className="chat-header">
      <div className="chat-header-content">
        <div className="chat-title">
          <span className="chat-status-dot"></span>
          <span>AI Assistant</span>
        </div>
        {expandable && (
          <button 
            className="chat-expand-btn"
            onClick={handleExpandClick}
            aria-label={localExpanded || isExpanded ? 'Exit fullscreen' : 'Fullscreen'}
            title={localExpanded || isExpanded ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
          >
            {(localExpanded || isExpanded) ? (
              // Collapse icon
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/>
              </svg>
            ) : (
              // Expand icon
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;