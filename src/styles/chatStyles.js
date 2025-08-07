// src/styles/chatStyles.js
export const injectChatStyles = () => {
  const styleId = 'ai-chat-styles';
  
  if (document.getElementById(styleId)) {
    return;
  }

  const styles = `
    .chat-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9998;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      background: #1a1a1a;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      transition: all 0.3s ease;
    }

    .chat-container.expanded {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 800px;
      height: 80vh;
      z-index: 9999;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    /* Dark Theme */
    .chat-theme-dark {
      background: #1a1a1a;
      color: #ffffff;
    }

    .chat-theme-dark .chat-header {
      background: linear-gradient(135deg, #0E0146 0%, #1a0a5e 100%);  /* Changed to purple gradient */
      border-bottom: 1px solid #333;
      padding: 10px 16px;  /* Reduced padding to match editor height */
    }

    .chat-theme-dark .chat-messages {
      background: #1a1a1a;
    }

    .chat-theme-dark .chat-message-user .chat-message-content {
      background: #0066ff;
      color: white;
    }

    .chat-theme-dark .chat-message-assistant .chat-message-content {
      background: #333;
      color: white;
    }

    .chat-theme-dark .chat-input {
      background: #333;
      color: white;
      border: 1px solid #444;
    }

    .chat-theme-dark .chat-input:focus {
      border-color: #0066ff;
    }

    /* Light Theme */
    .chat-theme-light {
      background: #ffffff;
      color: #1a1a1a;
    }

    .chat-theme-light .chat-header {
      background: linear-gradient(135deg, #0E0146 0%, #1a0a5e 100%);  /* Changed to purple gradient */
      border-bottom: 1px solid #e2e8f0;
      color: white;  /* Added white text for purple background */
      padding: 10px 16px;  /* Reduced padding to match editor height */
    }

    .chat-theme-light .chat-messages {
      background: #ffffff;
    }

    .chat-theme-light .chat-message-user .chat-message-content {
      background: #0066ff;
      color: white;
    }

    .chat-theme-light .chat-message-assistant .chat-message-content {
      background: #f7f8fa;
      color: #1a1a1a;
    }

    .chat-theme-light .chat-input {
      background: #f7f8fa;
      color: #1a1a1a;
      border: 1px solid #e2e8f0;
    }

    /* Header */
    .chat-header {
      padding: 10px 16px;  /* Reduced from 12px 16px */
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .chat-header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .chat-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
    }

    .chat-status-dot {
      width: 8px;
      height: 8px;
      background: #4ade80;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
      100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
    }

    .chat-expand-btn {
      background: transparent;
      border: none;
      color: inherit;
      padding: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .chat-expand-btn:hover {
      opacity: 1;
    }

    /* Messages */
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .chat-messages::-webkit-scrollbar {
      width: 6px;
    }

    .chat-messages::-webkit-scrollbar-track {
      background: transparent;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: #444;
      border-radius: 3px;
    }

    .chat-empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0.5;
    }

    .chat-empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .chat-empty-message {
      font-size: 16px;
    }

    .chat-message {
      display: flex;
      flex-direction: column;
      gap: 4px;
      animation: messageSlide 0.3s ease-out;
    }

    @keyframes messageSlide {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .chat-message-user {
      align-items: flex-end;
    }

    .chat-message-assistant {
      align-items: flex-start;
    }

    .chat-message-content {
      max-width: 70%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .chat-message-user .chat-message-content {
      border-bottom-right-radius: 4px;
    }

    .chat-message-assistant .chat-message-content {
      border-bottom-left-radius: 4px;
    }

    .chat-message-time {
      font-size: 11px;
      opacity: 0.5;
      padding: 0 4px;
    }

    .chat-typing-indicator {
      display: flex;
      gap: 4px;
      padding: 4px 0;
    }

    .chat-typing-indicator span {
      width: 8px;
      height: 8px;
      background: currentColor;
      border-radius: 50%;
      opacity: 0.5;
      animation: typing 1.4s infinite;
    }

    .chat-typing-indicator span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .chat-typing-indicator span:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes typing {
      0%, 60%, 100% {
        transform: translateY(0);
        opacity: 0.5;
      }
      30% {
        transform: translateY(-10px);
        opacity: 1;
      }
    }

    /* Input */
    .chat-input-wrapper {
      border-top: 1px solid #333;
      background: #222;
    }

    .chat-input-form {
      display: flex;
      padding: 12px;
      gap: 8px;
    }

    .chat-input {
      flex: 1;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      resize: none;
      font-family: inherit;
      min-height: 40px;
      max-height: 100px;
    }

    .chat-input::placeholder {
      opacity: 0.5;
    }

    .chat-send-btn {
      width: 40px;
      height: 40px;
      padding: 0;
      background: #0066ff;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s;
    }

    .chat-send-btn:hover:not(:disabled) {
      opacity: 0.9;
    }

    .chat-send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .chat-input-guidance {
      padding: 8px 16px;
      font-size: 11px;
      opacity: 0.5;
      display: flex;
      flex-direction: column;
      gap: 4px;
      border-top: 1px solid #333;
    }

    .chat-guidance-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .chat-guidance-separator {
      opacity: 0.3;
    }

    @media (max-width: 640px) {
      .chat-container.expanded {
        width: 100%;
        height: 100%;
        max-width: none;
        border-radius: 0;
      }

      .chat-message-content {
        max-width: 85%;
      }

      .chat-input-guidance {
        font-size: 10px;
        padding: 6px 12px;
      }
    }
  `;

  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
};