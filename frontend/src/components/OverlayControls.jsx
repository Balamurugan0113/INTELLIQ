import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import ChatbotUI from './ChatbotUI';
import { FaRobot, FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import './OverlayControls.css';

export default function OverlayControls() {
  const [chatOpen, setChatOpen] = useState(false);
  
  // Audio state
  const [playing, setPlaying] = useState(false); // Start false to eradicate NotAllowedError
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const toggleChat = () => setChatOpen(!chatOpen);
  const togglePlay = () => setPlaying(!playing);
  const toggleMute = () => {
    if (muted && volume === 0) setVolume(0.5);
    setMuted(!muted);
  };

  const [hasInteracted, setHasInteracted] = useState(false);

  // Eradicate `NotAllowedError` by waiting for first page interaction (click/scroll/key)
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setPlaying(true);
        setHasInteracted(true);
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('scroll', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [hasInteracted]);

  return (
    <>
      <div className="hidden-player-wrapper">
        <ReactPlayer 
          url="https://www.youtube.com/watch?v=L7kF4MXXCoA"
          playing={playing}
          volume={volume}
          muted={muted}
          loop={true}
          width="200px"
          height="200px"
          onStart={() => console.log('Background music successfully started!')}
          onError={(e) => console.log('Background music error:', e)}
          config={{
            youtube: {
              playerVars: { origin: window.location.origin }
            }
          }}
        />
      </div>

      {/* Audio Controls on LEFT */}
      <div className="overlay-audio-container">
        <div 
          className="audio-controls-group" 
          onMouseEnter={() => setShowVolumeSlider(true)} 
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <button className="small-base-toggle-btn" onClick={togglePlay} title="Play / Pause">
            {playing ? <FaPause /> : <FaPlay />}
          </button>
          <button className="small-base-toggle-btn" onClick={toggleMute} title="Mute / Unmute">
            {muted || Math.abs(volume) < 0.01 ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          
          <div className="volume-slider-container" style={{ width: showVolumeSlider ? '60px' : '0' }}>
            <input 
              type="range" 
              min="0" max="1" step="0.05" 
              value={muted ? 0 : volume} 
              onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (parseFloat(e.target.value) > 0) setMuted(false);
              }}
              className="volume-slider"
            />
          </div>
        </div>
      </div>

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
