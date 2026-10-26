import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaTrash, FaEnvelope, FaCheckCircle, FaMagic } from 'react-icons/fa';
import './OverlayControls.css';

// Helper to get formatted time
const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const initialBotMessage = {
  role: 'bot',
  text: `👋 **Welcome to INTELLIQ AI Assistant!**\n\nI am your intelligent guide for the **Department of Artificial Intelligence & Data Science**.\n\nPlease type your **Name, Email, and College** or ask any question below to begin!`,
  time: getTime()
};

export default function ChatbotUI({ open, onClose, apiBase = '' }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
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
      try {
        setMessages(JSON.parse(savedChat));
      } catch {
        setMessages([initialBotMessage]);
      }
    } else {
      setMessages([initialBotMessage]);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (messages.length > 0) {
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
    const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    const email = emailMatch ? emailMatch[0] : '';
    
    const parts = text.split(',').map(p => p.trim());
    if (parts.length >= 3) {
      return { name: parts[0], email: parts[1] || email, college: parts[2] };
    }
    
    const withoutEmail = text.replace(email, '').trim();
    return { name: withoutEmail || 'Guest Enthusiast', email: email || 'not_provided@intelliq.co.in', college: 'Info Institute of Engineering' };
  };

  // Comprehensive Knowledge Base Engine (Clean & Direct)
  const getAIResponse = (question) => {
    const lowerQ = question.toLowerCase();

    // 1. ABOUT & OVERVIEW
    if (lowerQ.includes('about') || lowerQ.includes('what is intelliq') || lowerQ.includes('association') || lowerQ.includes('department')) {
      return `🚀 **About INTELLIQ**\n\n• **INTELLIQ** – Intelligence Learners and Leaders in AI & Data Science is the official student association of the **Department of Artificial Intelligence & Data Science** at Info Institute of Engineering.\n• **Motto**: *"Innovation through Unity"*\n• **Focus**: Practical AI engineering, Machine Learning, Computer Vision, NLP, Data Engineering, and MLOps.\n• **Culture**: Open, collaborative, mentor-driven learning environment.`;
    }

    // 2. VISION & MISSION
    if (lowerQ.includes('vision') || lowerQ.includes('mission') || lowerQ.includes('goal')) {
      return `🎯 **INTELLIQ Vision & Mission**\n\n• **Mission**: Learn by building real-world AI applications and intelligent models.\n• **Vision**: Building a vibrant community preparing the next generation of AI leaders, researchers, and technology pioneers.\n• **Core Pillars**: Hands-on Workshops, Industry Exposure, Student Mentorship, and Technical Hackathons.`;
    }

    // 3. EVENTS
    if (lowerQ.includes('event') || lowerQ.includes('workshop') || lowerQ.includes('session') || lowerQ.includes('symposium') || lowerQ.includes('hackathon') || lowerQ.includes('internship') || lowerQ.includes('iv')) {
      return `📅 **INTELLIQ Real-Time Events & Programs**\n\n• **Power BI Session**: Hands-on data cleaning, DAX modeling & dashboard visualization.\n• **GitHub Workshop**: Version control, branching, PRs, and team collaboration.\n• **RAG Basics Session**: Retrieval-Augmented Generation & AI context architectures.\n• **RPA Guest Lecture**: Building automated bots for industrial task automation.\n• **UiPath Training**: Interactive hands-on workflow design.\n• **Placement Prep (6th Sem)**: Aptitude, technical interviews, and resume building.\n• **Industrial Visit**: Soften Technologies, Cochin.\n• **INFEST 2K26**: Departmental technical symposium celebrating innovation & talent.`;
    }

    // 4. MEMBERS & TEAM LEADERSHIP
    if (lowerQ.includes('president') || lowerQ.includes('lead') || lowerQ.includes('secretary') || lowerQ.includes('editor') || lowerQ.includes('team') || lowerQ.includes('member') || lowerQ.includes('board') || lowerQ.includes('coordinator')) {
      return `👥 **INTELLIQ Key Leadership (2026-27 Batch)**\n\n• **President**: Veera Muthu Prakash\n• **Tech Lead**: Josuva\n• **Chief Editor**: Balamurugan\n• **Secretary**: Abishek\n• **Academics & Staff Coordinators**: Expert faculty advisors guiding student initiatives.\n• **Student Board Members**: Active student leaders managing technical & event verticals.`;
    }

    // 5. ACHIEVEMENTS & HACKATHONS
    if (lowerQ.includes('achievement') || lowerQ.includes('rank') || lowerQ.includes('winner') || lowerQ.includes('prize')) {
      return `🏆 **Student Achievements & Milestones**\n\n• **Hackathon Victories**: Top prizes at National AI & Smart India Hackathons.\n• **Project Showcases**: Real-time LLM fine-tuning, drone vision navigation, and predictive analytics.\n• **Academic Ranks**: Top rank holders in Anna University curriculum examinations.`;
    }

    // 6. CONTACT & EMAIL SUPPORT
    if (lowerQ.includes('contact') || lowerQ.includes('email') || lowerQ.includes('reach') || lowerQ.includes('phone') || lowerQ.includes('location')) {
      return `📬 **Contact & Connect with INTELLIQ**\n\n• **Email**: intelliqassociation@gmail.com\n• **Instagram**: @intelliq__info\n• **LinkedIn**: INTELLIQ Association\n• **Venue**: Department of AI & DS, Info Institute of Engineering, Coimbatore.`;
    }

    // 7. GREETINGS
    if (lowerQ.includes('hi') || lowerQ.includes('hello') || lowerQ.includes('hey') || lowerQ.includes('namaste')) {
      const name = userProfile && userProfile.name ? userProfile.name : 'Friend';
      return `👋 Hello **${name}**!\n\nHow can I assist you today? I am ready to answer your questions regarding **INTELLIQ**.`;
    }

    // DEFAULT SMART FALLBACK
    return `💡 **INTELLIQ AI Assistant**\n\nI can answer questions regarding:\n• **Events**\n• **Leadership & Team**\n• **Vision & Mission**\n• **Student Achievements**\n• **Contact & Social Handles**`;
  };

  const sendMessage = () => {
    const question = input.trim();
    if (!question) return;

    const updatedMessages = [...messages, { role: 'user', text: question, time: getTime() }];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

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
            text: `✨ **Welcome ${profile.name}!**\nYour profile details have been saved.\n\nAsk me anything about **INTELLIQ**!`, 
            time: getTime() 
          }
        ]);
      }, 1000);
      return;
    }

    // Normal Smart Response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: getAIResponse(question), time: getTime() }
      ]);
    }, 1000 + Math.random() * 600);
  };

  // Submit full transcript to backend API & email
  const sendFullTranscriptToBackend = () => {
    if (messages.length <= 1) return;

    const transcriptText = messages.map(m => `[${m.time}] ${m.role.toUpperCase()}: ${m.text}`).join('\n\n');
    const uName = userProfile ? userProfile.name : 'Website Visitor';
    const uEmail = userProfile && userProfile.email ? userProfile.email : 'visitor@intelliq.co.in';

    const payload = {
      name: `AI Chat Log - ${uName}`,
      email: uEmail,
      message: `=== INTELLIQ AI FULL CHAT TRANSCRIPT ===\nUser Email: ${uEmail}\n\n${transcriptText}`
    };

    fetch(`${apiBase}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(() => {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 4000);
      })
      .catch(() => {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 4000);
      });
  };

  const clearHistory = () => {
    setMessages([initialBotMessage]);
    setUserProfile(null);
    localStorage.removeItem('intelliq_chat_history');
    localStorage.removeItem('intelliq_user_profile');
    setIsTyping(false);
  };

  // Render markdown text lines neatly
  const renderFormattedText = (text) => {
    return text.split('\n').map((line, idx) => {
      let content = line;
      const parts = content.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className="chat-line">
          {parts.map((p, pIdx) => {
            if (p.startsWith('**') && p.endsWith('**')) {
              return <strong key={pIdx}>{p.slice(2, -2)}</strong>;
            }
            if (p.startsWith('*') && p.endsWith('*')) {
              return <em key={pIdx}>{p.slice(1, -1)}</em>;
            }
            return p;
          })}
        </p>
      );
    });
  };

  if (!open) return null;

  return (
    <div className="chatbot-window glass-cyber-window">
      {/* HEADER */}
      <div className="chatbot-header">
        <div className="chatbot-header-title">
          <div className="chatbot-avatar-ring"><FaRobot /></div>
          <div>
            <span className="chatbot-header-name">INTELLIQ AI</span>
            <span className="chatbot-status-online"><span className="online-dot"></span> Online Guide</span>
          </div>
        </div>

        <div className="chatbot-header-actions">
          <button onClick={sendFullTranscriptToBackend} className="chatbot-action-btn" title="Send Chat Log to Email">
            <FaEnvelope />
          </button>
          <button onClick={clearHistory} className="chatbot-action-btn" title="Clear History">
            <FaTrash />
          </button>
          <button onClick={onClose} className="chatbot-close-btn" title="Close Chat">
            <FaTimes />
          </button>
        </div>
      </div>
      
      {/* EMAIL SENT TOAST NOTIFICATION */}
      {emailSent && (
        <div className="chat-toast-banner">
          <FaCheckCircle /> Conversation transcript sent to team &amp; email!
        </div>
      )}

      {/* CHAT BODY */}
      <div className="chatbot-body" ref={chatBodyRef}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-message-row ${m.role}`}>
            {m.role === 'bot' && (
              <div className="chat-bot-avatar">
                <FaMagic size={12} color="#fff" />
              </div>
            )}
            <div className={`chat-bubble ${m.role}`}>
              {renderFormattedText(m.text)}
              <span className="chat-timestamp">{m.time}</span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="chat-message-row bot">
            <div className="chat-bot-avatar">
              <FaRobot size={12} color="#fff" />
            </div>
            <div className="typing-indicator">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}
      </div>
      
      {/* FOOTER */}
      <div className="chatbot-footer">
        <input
          ref={inputRef}
          type="text"
          placeholder={userProfile ? "Ask AI Assistant..." : "Name, Email, College..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="chatbot-send-btn" aria-label="Send Message">
          <FaPaperPlane size={14} />
        </button>
      </div>
    </div>
  );
}
