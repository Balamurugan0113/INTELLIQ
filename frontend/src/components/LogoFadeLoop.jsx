// frontend/src/components/LogoFadeLoop.jsx
import React, { useMemo, useState } from "react";
import "./LogoFadeLoop.css";

/** Fisher–Yates shuffle */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

import { FaHandshake } from "react-icons/fa";

export default function LogoFadeLoop({
  images = [],
  title = "OUR COLLABORATORS",
  speed = 28, // seconds (lower = faster)
}) {
  const [paused, setPaused] = useState(false);

  // shuffle once (stable)
  const order = useMemo(() => {
    return images?.length ? shuffleArray(images) : [];
  }, [images]);

  // duplicate list for seamless loop
  const loopLogos = useMemo(() => {
    if (!order.length) return [];
    return [...order, ...order];
  }, [order]);

  if (!order.length) return null;

  return (
    <div className="logo-fade-wrapper">
      <div className="section-title-wrapper" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div className="out-of-the-box-heading">
          <FaHandshake className="ootb-icon" />
          <h2 className="section-title neon-heading">{title}</h2>
        </div>
      </div>

      <div
        className={`logo-marquee ${paused ? "paused" : ""}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="logo-marquee-track"
          style={{ animationDuration: `${speed}s` }}
        >
          {loopLogos.map((src, idx) => (
            <div className="logo-marquee-item" key={`${src}-${idx}`}>
              <img
                src={src}
                alt="Collaborator logo"
                draggable={false}
                className="logo-marquee-img"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
