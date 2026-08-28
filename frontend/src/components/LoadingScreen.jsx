import React, { useEffect, useState } from "react";
import "./LoadingScreen.css";

export default function LoadingScreen({ onFinished }) {
  const [progress, setProgress] = useState(0);
  const [zoomMax, setZoomMax] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 1. Paced progress counter (0% to 100% in ~3.6s)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Steady increment for cinematic loading feel
        const diff = Math.floor(Math.random() * 6) + 4;
        return Math.min(prev + diff, 100);
      });
    }, 150);

    // 2. Trigger hyper-zoom expansion once progress reaches 100%
    const zoomTimer = setTimeout(() => {
      setZoomMax(true);
    }, 3800);

    // 3. Initiate dissolve & page reveal
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 4200);

    // 4. Complete transition and reveal website
    const finishTimer = setTimeout(() => {
      if (onFinished) onFinished();
    }, 4800);

    return () => {
      clearInterval(interval);
      clearTimeout(zoomTimer);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinished]);

  const getStatusText = (val) => {
    if (val < 30) return "INITIALIZING NEURAL CORE...";
    if (val < 60) return "LOADING AI & DS ECOSYSTEM...";
    if (val < 90) return "SYNCHRONIZING INTELLIQ DATA...";
    return "SYSTEM READY — LAUNCHING...";
  };

  return (
    <div className={`loading-screen ${zoomMax ? "zoom-max-active" : ""} ${fadeOut ? "fade-out" : ""}`}>
      {/* ANIMATED SCANNING GRID & PARTICLES */}
      <div className="animated-grid-bg"></div>
      <div className="laser-sweep-line"></div>

      {/* FLOATING CYBER PARTICLES */}
      <div className="particles-layer">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`cyber-particle p${i + 1}`}></div>
        ))}
      </div>

      <div className="loading-content">
        {/* MULTI-RING ORBITING LOGO CONTAINER */}
        <div className="logo-orbit-container">
          <div className="orbit-ring ring-1"></div>
          <div className="orbit-ring ring-2"></div>
          <div className="orbit-ring ring-3"></div>
          <div className="energy-core-glow"></div>

          <img src="/Logo.png" alt="INTELLIQ Logo" className="loading-logo" />
        </div>

        {/* ANIMATED TEXT & PROGRESS GROUP */}
        <div className="loading-text-group">
          <h1 className="loading-title" data-text="INTELLIQ">
            INTELLIQ
          </h1>
          <p className="loading-subtitle">Association of Artificial Intelligence &amp; Data Science</p>

          <div className="tech-status-row">
            <span className="status-text">{getStatusText(progress)}</span>
            <span className="progress-counter">{progress}%</span>
          </div>

          <div className="loading-bar-container">
            <div className="loading-bar-fill" style={{ width: `${progress}%` }}></div>
            <div className="bar-glow-dot" style={{ left: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
