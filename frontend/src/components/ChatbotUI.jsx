import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaTelegramPlane } from 'react-icons/fa';
import './OverlayControls.css';
import { SAMPLE as memberData } from './Members';

// Helper to get formatted time
const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const initialBotMessage = {
  role: 'bot',
  text: 'Hi! I’m INTELLIQ AI Guide.\nWelcome to the Association of AI & DS.\nCould you please share your Name, College, and Email to get started?',
  time: getTime()
};

export default function ChatbotUI({ open, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);

  // Load from LocalStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('intelliq_user_profile');
    const savedChat = localStorage.getItem('intelliq_chat_history');
    
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    } else {
      setMessages([initialBotMessage]);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (messages.length > 1 || (messages.length === 1 && messages[0].role !== 'bot')) {
      localStorage.setItem('intelliq_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('intelliq_user_profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  // Auto scroll
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping, open]);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 150);
    }
  }, [open]);

  const extractProfile = (text) => {
    const parts = text.split(',').map(p => p.trim());
    if (parts.length >= 3) {
      return { name: parts[0], college: parts[1], email: parts[2] };
    }
    
    const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    const email = emailMatch ? emailMatch[0] : '';
    const withoutEmail = text.replace(email, '').trim();
    
    return { name: withoutEmail || 'Guest', college: 'Not specified', email };
  };

  const getAIResponse = (question) => {
    let lowerQ = question.toLowerCase();
    
    // Website Details
    if (lowerQ.includes('event')) {
      return "INTELLIQ hosts amazing events! Check out the 'Events' section on our page for interactive timelines of our past and upcoming workshops, hackathons, and guest lectures.";
    } else if (lowerQ.includes('project')) {
      return "Our students work on cutting-edge real-time projects! These include LLM fine-tuning, computer vision for drone navigation, and predictive analytics dashboards. Let me know if you want to collaborate!";
    } else if (lowerQ.includes('about') || lowerQ.includes('what is intelliq') || lowerQ.includes('website')) {
      return "INTELLIQ is the official Association of Artificial Intelligence & Data Science department. We aim to foster innovation, organize hackathons, and build real-time projects!";
    } else if (lowerQ.includes('contact') || lowerQ.includes('reach')) {
      return "You can reach out to us via the Contact section below, or drop a message on our official handles!";
    }
    
    // Member specific queries
    if (lowerQ.includes('members') || lowerQ.includes('team') || lowerQ.includes('committee')) {
      const execs = memberData.filter(m => m.role.toLowerCase().includes('president') || m.role.toLowerCase().includes('secretary'));
      const names = execs.map(m => m.name).join(', ');
      return `We have an incredible team of ${memberData.length} members! Key contacts include ${names}... If you want to know about a specific role or person, just ask!`;
    }

    // "who is the <role>" or "<role> head"
    const roleMatch = lowerQ.match(/who is the (.*)/) || lowerQ.match(/who is (.*)/) || lowerQ.match(/(.*) head/);
    if (roleMatch && roleMatch[1]) {
      let search = roleMatch[1].replace('?', '').trim();
      let found = memberData.find(m => m.role.toLowerCase().includes(search));
      if (found) {
        return `${found.name} is the ${found.role} of INTELLIQ.\nCheck out their profile in the Members section!`;
      }
    }
    
    // Query by specific member name (e.g., "tell me about Veera")
    let foundByName = memberData.find(m => {
       const firstName = m.name.toLowerCase().split(' ')[0];
       return lowerQ.includes(firstName) && firstName.length > 2; // basic safety
    });
    
    if (foundByName) {
      return `${foundByName.name} is currently the ${foundByName.role} of INTELLIQ.`;
    }
    
    // Greetings
    if (lowerQ.includes('hi') || lowerQ.includes('hello') || lowerQ.includes('hey')) {
      return `Hello ${userProfile && userProfile.name !== 'Guest' ? userProfile.name : 'there'}! How can I help you today regarding INTELLIQ?`;
    }

    return "That's interesting! I can answer questions about the website, events, projects, or our team members (try asking: 'who is the president?', 'members', 'projects'). Feel free to ask!";
  };

  const sendMessage = () => {
    const question = input.trim();
    if (!question) return;

    // Push user message
    const updatedMessages = [...messages, { role: 'user', text: question, time: getTime() }];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true); // Start typing animation

    // Profile Setup (First Interaction)
    if (!userProfile) {
      const profile = extractProfile(question);
      setUserProfile(profile);
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          { 
            role: 'bot', 
            text: `Thanks ${profile.name} from ${profile.college}! Your details are saved.\n\nNow, ask me anything about INTELLIQ (try "what is intelliq?", "events", or "who is the president?").`, 
            time: getTime() 
          }
        ]);
      }, 1500);
      return;
    }

    // Normal Smart Response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: getAIResponse(question), time: getTime() }
      ]);
    }, 1200 + Math.random() * 800); // Dynamic typing delay 1.2s - 2.0s
  };

  const clearHistory = () => {
    setMessages([initialBotMessage]);
    setUserProfile(null);
    localStorage.removeItem('intelliq_chat_history');
    localStorage.removeItem('intelliq_user_profile');
    setIsTyping(false);
  };

  if (!open) return null;

  return (
    <div className="chatbot-window">
      <div className="chatbot-header">
        <div className="chatbot-header-title">
          <FaRobot style={{ marginRight: '8px' }} /> <span style={{color: '#fff', fontWeight: 600, letterSpacing: '0.05em'}}>INTELLIQ AI</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={clearHistory} className="chatbot-clear-btn" title="Clear Chat History">Clear</button>
            <button onClick={onClose} className="chatbot-close-btn"><FaTimes /></button>
        </div>
      </div>
      
      <div className="chatbot-body" ref={chatBodyRef}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-message-row ${m.role}`}>
            {m.role === 'bot' && (
              <div className="chat-bot-avatar">
                <FaRobot size={14} color="#000" />
              </div>
            )}
            <div className={`chat-bubble ${m.role}`}>
              {m.text.split('\n').map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
              <span className="chat-timestamp">{m.time}</span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="chat-message-row bot">
            <div className="chat-bot-avatar">
              <FaRobot size={14} color="#000" />
            </div>
            <div className="typing-indicator">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}
      </div>
      
      <div className="chatbot-footer">
        <input
          ref={inputRef}
          type="text"
          placeholder={userProfile ? "Ask about events, members, etc..." : "Name, College, Email"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="chatbot-send-btn">
          <FaTelegramPlane size={18} />
        </button>
      </div>
    </div>
  );
}
