import React, { useState } from 'react';
import ChatbotUI from './ChatbotUI';
import { FaRobot } from 'react-icons/fa';
import './OverlayControls.css';

export default function OverlayControls() {
  const [chatOpen, setChatOpen] = useState(false);

  const toggleChat = () => setChatOpen(!chatOpen);

  return (
    <div className="overlay-chatbot-container">
      <ChatbotUI open={chatOpen} onClose={() => setChatOpen(false)} />
      
      {/* 3D ANIMATED AI CHATBOT LOGO BUTTON (BOTTOM-LEFT CORNER) */}
      <div className="floating-buttons">
        <button 
          className={`base-toggle-btn chat-toggle-3d ${chatOpen ? 'active' : ''}`}
          onClick={toggleChat}
          title="Toggle INTELLIQ AI Assistant"
          aria-label="Toggle INTELLIQ AI Assistant"
        >
          <div className="bot-3d-orb">
            <div className="bot-3d-ring"></div>
            <div className="bot-3d-core">
              <FaRobot className="bot-3d-icon" />
            </div>
            <span className="bot-3d-glow-pulse"></span>
          </div>
        </button>
      </div>
    </div>
  );
}
