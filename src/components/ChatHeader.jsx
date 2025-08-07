import React from 'react';

const ChatHeader = ({ isExpanded, expandable, onToggleExpand }) => {
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
            onClick={onToggleExpand}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/>
              </svg>
            ) : (
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