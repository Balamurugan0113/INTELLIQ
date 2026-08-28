import React, { useState } from 'react';
import ChatbotUI from './ChatbotUI';
import { FaRobot } from 'react-icons/fa';
import './OverlayControls.css';

export default function OverlayControls() {
  const [chatOpen, setChatOpen] = useState(false);

  const toggleChat = () => setChatOpen(!chatOpen);

  return (
    <>
      {/* Chatbot on RIGHT */}
      <div className="overlay-chatbot-container">
        <ChatbotUI open={chatOpen} onClose={() => setChatOpen(false)} />
        <div className="floating-buttons">
          <button 
            className={`base-toggle-btn chat-toggle ${chatOpen ? 'active' : ''}`}
            onClick={toggleChat}
            title="Toggle AI Chatbot"
          >
            <FaRobot size={24} />
          </button>
        </div>
      </div>
    </>
  );
}
