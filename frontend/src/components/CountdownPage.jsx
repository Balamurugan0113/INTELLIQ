import React, { useState, useEffect } from "react";
import "./CountdownPage.css";
import logo from "../assests/logo.png";
import { FaClock, FaRocket, FaInstagram, FaEnvelope } from "react-icons/fa";

export default function CountdownPage({ targetDate, onReveal }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsReady(true);
        if (onReveal) onReveal();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate, onReveal]);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="countdown-wrapper">
      {/* BACKGROUND SCANNING GRID & PARTICLES */}
      <div className="cyber-grid-bg"></div>
      <div className="laser-beam"></div>

      <div className="countdown-card glass-panel">
        {/* LOGO HEADER */}
        <div className="countdown-logo-box">
          <img src={logo} alt="INTELLIQ Logo" className="countdown-logo" />
        </div>

        <h1 className="countdown-main-title">INTELLIQ</h1>
        <p className="countdown-sub-title">Association of Artificial Intelligence &amp; Data Science</p>

        <div className="launch-status-pill">
          <FaRocket className="status-rocket-icon" />
          <span>OFFICIAL WEBSITE LAUNCHING SOON</span>
        </div>

        {/* 4-DIGIT COUNTDOWN CLOCK */}
        <div className="timer-grid">
          <div className="timer-box">
            <span className="timer-val neon-yellow">{pad(timeLeft.days)}</span>
            <span className="timer-lbl">DAYS</span>
          </div>

          <span className="timer-colon">:</span>

          <div className="timer-box">
            <span className="timer-val neon-cyan">{pad(timeLeft.hours)}</span>
            <span className="timer-lbl">HOURS</span>
          </div>

          <span className="timer-colon">:</span>

          <div className="timer-box">
            <span className="timer-val neon-pink">{pad(timeLeft.minutes)}</span>
            <span className="timer-lbl">MINUTES</span>
          </div>

          <span className="timer-colon">:</span>

          <div className="timer-box">
            <span className="timer-val neon-green">{pad(timeLeft.seconds)}</span>
            <span className="timer-lbl">SECONDS</span>
          </div>
        </div>

        {/* TARGET REVEAL BANNER */}
        <div className="reveal-info-box">
          <FaClock style={{ color: "#01cefc", marginRight: "6px" }} />
          <span>Target Reveal: <strong>September 1, 2026 at 3:39 PM</strong></span>
        </div>

        {/* SOCIAL & CONNECT LINKS */}
        <div className="countdown-social-row">
          <a href="https://instagram.com/intelliq__info" target="_blank" rel="noopener noreferrer" className="cd-social-link">
            <FaInstagram /> @intelliq__info
          </a>
          <a href="mailto:intelliqassociation@gmail.com" className="cd-social-link">
            <FaEnvelope /> intelliqassociation@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
