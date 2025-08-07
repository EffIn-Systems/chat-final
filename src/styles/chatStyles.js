// src/styles/chatStyles.js
export const injectChatStyles = () => {
  const styleId = 'ai-chat-styles';
  
  if (document.getElementById(styleId)) {
    return;
  }

  const styles = `
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(83, 113, 247, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(83, 113, 247, 0); }
      100% { box-shadow: 0 0 0 0 rgba(83, 113, 247, 0); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
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

    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      transition: all 0.3s ease;
      border: 1px solid rgba(14, 1, 70, 0.08);
    }

    .chat-container.expanded {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 1200px;
      height: 80vh;
      z-index: 9999;
      box-shadow: 0 20px 60px rgba(14, 1, 70, 0.3);
    }

    /* Header matching editor style */
    .chat-header {
      background: linear-gradient(135deg, #0E0146 0%, #1a0a5e 100%);
      padding: 12px 20px;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.5px;
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
    }

    .chat-status-dot {
      width: 8px;
      height: 8px;
      background: #5371F7;
      border-radius: 50%;
      display: inline-block;
      animation: pulse 2s infinite;
    }

    .chat-expand-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      padding: 6px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .chat-expand-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
    }

    /* Messages */
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .chat-messages::-webkit-scrollbar {
      width: 8px;
    }

    .chat-messages::-webkit-scrollbar-track {
      background: rgba(14, 1, 70, 0.02);
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: rgba(14, 1, 70, 0.2);
      border-radius: 4px;
    }

    .chat-messages::-webkit-scrollbar-thumb:hover {
      background: rgba(14, 1, 70, 0.3);
    }

    .chat-empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #0E0146;
      opacity: 0.4;
    }

    .chat-empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .chat-empty-message {
      font-size: 16px;
      font-weight: 500;
    }

    .chat-message {
      display: flex;
      flex-direction: column;
      gap: 4px;
      animation: messageSlide 0.3s ease-out;
    }

    .chat-message-user {
      align-items: flex-end;
    }

    .chat-message-assistant {
      align-items: flex-start;
    }

    .chat-message-content {
      max-width: 70%;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .chat-message-user .chat-message-content {
      background: linear-gradient(135deg, #5371F7 0%, #0E0146 100%);
      color: white;
      border-bottom-right-radius: 4px;
    }

    .chat-message-assistant .chat-message-content {
      background: rgba(83, 113, 247, 0.08);
      color: #0E0146;
      border: 1px solid rgba(14, 1, 70, 0.1);
      border-bottom-left-radius: 4px;
    }

    .chat-message-time {
      font-size: 11px;
      color: rgba(14, 1, 70, 0.4);
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
      background: #5371F7;
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

    /* Input */
    .chat-input-wrapper {
      background: rgba(83, 113, 247, 0.02);
      border-top: 1px solid rgba(14, 1, 70, 0.08);
    }

    .chat-input-form {
      display: flex;
      padding: 12px;
      gap: 8px;
    }

    .chat-input {
      flex: 1;
      padding: 10px 14px;
      background: white;
      color: #0E0146;
      border: 1px solid rgba(14, 1, 70, 0.15);
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      resize: none;
      font-family: inherit;
      min-height: 40px;
      max-height: 100px;
      transition: all 0.2s;
    }

    .chat-input:focus {
      border-color: #5371F7;
      box-shadow: 0 0 0 3px rgba(83, 113, 247, 0.1);
    }

    .chat-input::placeholder {
      color: rgba(14, 1, 70, 0.4);
    }

    .chat-input:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: rgba(14, 1, 70, 0.02);
    }

    .chat-send-btn {
      width: 40px;
      height: 40px;
      padding: 0;
      background: linear-gradient(135deg, #5371F7 0%, #0E0146 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .chat-send-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(83, 113, 247, 0.3);
    }

    .chat-send-btn:active:not(:disabled) {
      transform: translateY(0);
    }

    .chat-send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: linear-gradient(135deg, rgba(83, 113, 247, 0.5) 0%, rgba(14, 1, 70, 0.5) 100%);
    }

    .chat-input-guidance {
      padding: 8px 16px 10px;
      font-size: 11px;
      color: rgba(14, 1, 70, 0.5);
      background: rgba(83, 113, 247, 0.01);
      border-top: 1px solid rgba(14, 1, 70, 0.05);
    }

    .chat-guidance-row {
      display: flex;
      align-items: center;
      gap: 6px;
      line-height: 1.4;
    }

    .chat-guidance-row:not(:last-child) {
      margin-bottom: 3px;
    }

    .chat-guidance-separator {
      opacity: 0.3;
    }

    /* Dark theme overrides */
    .chat-theme-dark .chat-container {
      background: #1a1a1a;
      border-color: rgba(255, 255, 255, 0.1);
    }

    .chat-theme-dark .chat-messages {
      background: #1a1a1a;
    }

    .chat-theme-dark .chat-empty-state {
      color: rgba(255, 255, 255, 0.5);
    }

    .chat-theme-dark .chat-message-assistant .chat-message-content {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border-color: rgba(255, 255, 255, 0.2);
    }

    .chat-theme-dark .chat-input-wrapper {
      background: rgba(255, 255, 255, 0.05);
      border-top-color: rgba(255, 255, 255, 0.1);
    }

    .chat-theme-dark .chat-input {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border-color: rgba(255, 255, 255, 0.2);
    }

    .chat-theme-dark .chat-input:focus {
      border-color: #5371F7;
      background: rgba(255, 255, 255, 0.15);
    }

    .chat-theme-dark .chat-input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    .chat-theme-dark .chat-input-guidance {
      color: rgba(255, 255, 255, 0.4);
      background: transparent;
      border-top-color: rgba(255, 255, 255, 0.1);
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
        padding: 6px 12px 8px;
      }

      .chat-guidance-row {
        flex-wrap: wrap;
      }
    }
  `;

  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
};