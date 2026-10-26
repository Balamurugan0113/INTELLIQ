// frontend/src/components/ui/DollyGallery.jsx
'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import './DollyGallery.css';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  PlayIcon,
  PauseIcon,
  SparklesIcon
} from '@hugeicons/core-free-icons';

/**
 * DollyGallery
 * React Bits Pro - 3D depth scroll fly-through gallery
 * Images stacked in depth that you fly through on scroll or continuous momentum flight
 */
export default function DollyGallery({
  items = [],
  depthSpacing = 680,
  perspective = 1000,
  speed = 1.2,
  onItemClick,
  className = ''
}) {
  const containerRef = useRef(null);
  const worldRef = useRef(null);
  const plateRefs = useRef([]);

  const count = items.length;
  const maxZ = useMemo(() => Math.max(0, (count - 1) * depthSpacing), [count, depthSpacing]);

  // Motion physics state
  const stateRef = useRef({
    currentZ: 0,
    targetZ: 0,
    velocityZ: 0,
    tiltX: 0,
    tiltY: 0,
    targetTiltX: 0,
    targetTiltY: 0,
    isDragging: false,
    startY: 0,
    startTargetZ: 0,
    raf: 0
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Clamp helper
  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

  // Navigate to specific index
  const goToIndex = useCallback(
    index => {
      const target = clamp(index, 0, count - 1) * depthSpacing;
      stateRef.current.targetZ = target;
    },
    [count, depthSpacing]
  );

  const next = useCallback(() => {
    goToIndex(activeIndex + 1);
  }, [activeIndex, goToIndex]);

  const prev = useCallback(() => {
    goToIndex(activeIndex - 1);
  }, [activeIndex, goToIndex]);

  // Main Render Frame Loop (60/120fps requestAnimationFrame)
  useEffect(() => {
    const plates = plateRefs.current;
    if (!plates.length || count === 0) return;

    let lastTime = performance.now();

    const updateFrame = time => {
      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      const s = stateRef.current;

      // Autoplay flight
      if (isPlaying) {
        s.targetZ += 200 * dt;
        if (s.targetZ > maxZ + 100) {
          s.targetZ = 0;
          s.currentZ = -100;
        }
      }

      // Smooth Lerp for camera Z position
      s.currentZ += (s.targetZ - s.currentZ) * 0.085;

      // Smooth Lerp for mouse tilt
      s.tiltX += (s.targetTiltX - s.tiltX) * 0.1;
      s.tiltY += (s.targetTiltY - s.tiltY) * 0.1;

      // Calculate which index is currently in focus (closest to camera)
      const currentIdx = clamp(Math.round(s.currentZ / depthSpacing), 0, count - 1);
      setActiveIndex(currentIdx);

      // Render 3D World Transformation
      if (worldRef.current) {
        worldRef.current.style.transform = `rotateX(${s.tiltY.toFixed(2)}deg) rotateY(${s.tiltX.toFixed(2)}deg)`;
      }

      // Update each poster's 3D spatial matrix
      for (let i = 0; i < count; i++) {
        const el = plates[i];
        if (!el) continue;

        const baseZ = -i * depthSpacing;
        const dist = baseZ + s.currentZ;

        // Visual distance limits:
        // dist < -2200px: Plate is too far in distance
        // dist > +360px: Plate has flown past the camera
        if (dist < -2400 || dist > 420) {
          el.style.visibility = 'hidden';
          el.style.opacity = '0';
          continue;
        }

        el.style.visibility = 'visible';

        // Calculate opacity and scale based on fly-through position
        let opacity = 1;
        let scale = 1;
        let translateY = 0;
        let rotateZ = (i % 2 === 0 ? 1 : -1) * 1.5;

        if (dist < 0) {
          // Approaching from distance (-2400 -> 0)
          const enterProgress = clamp((dist + 2400) / 2000, 0, 1);
          opacity = Math.pow(enterProgress, 1.4);
          // Optional subtle depth blur simulation
          const blurAmount = Math.max(0, ((-dist - 300) / 400)).toFixed(1);
          el.style.filter = blurAmount > 0.5 ? `blur(${blurAmount}px)` : 'none';
        } else {
          // Flying past camera (0 -> +400px)
          const exitProgress = clamp(dist / 380, 0, 1);
          opacity = Math.max(0, 1 - Math.pow(exitProgress, 1.8));
          scale = 1 + exitProgress * 0.45;
          translateY = exitProgress * 80;
          rotateZ = rotateZ * (1 + exitProgress * 2);
          el.style.filter = 'none';
        }

        // Depth stacking layer
        const zIndex = 100 + Math.round((dist + 2000) / 10);
        el.style.zIndex = String(zIndex);

        el.style.opacity = opacity.toFixed(3);
        el.style.transform = `translate3d(0px, ${translateY.toFixed(1)}px, ${dist.toFixed(1)}px) scale(${scale.toFixed(3)}) rotateZ(${rotateZ.toFixed(2)}deg)`;
      }

      s.raf = requestAnimationFrame(updateFrame);
    };

    stateRef.current.raf = requestAnimationFrame(updateFrame);

    return () => {
      cancelAnimationFrame(stateRef.current.raf);
    };
  }, [count, depthSpacing, maxZ, isPlaying]);

  // Wheel scrubbing handler
  const handleWheel = useCallback(
    e => {
      e.preventDefault();
      setIsPlaying(false);
      const s = stateRef.current;
      const delta = e.deltaY * speed;
      s.targetZ = clamp(s.targetZ + delta, 0, maxZ);
    },
    [maxZ, speed]
  );

  // Pointer drag scrubbing handler
  const handlePointerDown = useCallback(e => {
    if (e.button > 0) return;
    setIsPlaying(false);
    const s = stateRef.current;
    s.isDragging = true;
    s.startY = e.clientY;
    s.startTargetZ = s.targetZ;
    containerRef.current?.setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    e => {
      const s = stateRef.current;
      const rect = containerRef.current?.getBoundingClientRect();

      // Mouse Parallax
      if (rect) {
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        s.targetTiltX = nx * 5.5; // left/right tilt degrees
        s.targetTiltY = -ny * 4.5; // up/down tilt degrees
      }

      // Drag Scrubbing
      if (s.isDragging) {
        const dy = s.startY - e.clientY;
        s.targetZ = clamp(s.startTargetZ + dy * 2.5 * speed, 0, maxZ);
      }
    },
    [maxZ, speed]
  );

  const handlePointerUp = useCallback(e => {
    const s = stateRef.current;
    s.isDragging = false;
    containerRef.current?.releasePointerCapture?.(e.pointerId);
  }, []);

  const handlePointerLeave = useCallback(() => {
    const s = stateRef.current;
    s.isDragging = false;
    s.targetTiltX = 0;
    s.targetTiltY = 0;
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsPlaying(false);
        next();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setIsPlaying(false);
        prev();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    },
    [next, prev]
  );

  // Attach wheel listener with passive: false to prevent outer scrolling during gallery scrub
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  return (
    <div
      ref={containerRef}
      className={`dolly-gallery-container${className ? ` ${className}` : ''}`}
      tabIndex={0}
      role="region"
      aria-label="3D Dolly Gallery Posters Showcase"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
    >
      {/* Scroll & Interaction Hint */}
      <div className="dolly-scroll-hint">
        <HugeiconsIcon icon={SparklesIcon} size={15} style={{ color: '#01cefc' }} />
        <span>Scroll, drag, or fly through stacked 3D depth</span>
      </div>

      {/* 3D Depth Stage */}
      <div className="dolly-gallery-stage" style={{ perspective: `${perspective}px` }}>
        {/* Background tunnel rings */}
        <div className="dolly-tunnel-ring" style={{ width: '480px', height: '480px' }} />
        <div className="dolly-tunnel-ring" style={{ width: '750px', height: '750px' }} />
        <div className="dolly-tunnel-ring" style={{ width: '1050px', height: '1050px' }} />

        {/* 3D Spatial World */}
        <div ref={worldRef} className="dolly-gallery-world">
          {items.map((item, index) => (
            <div
              key={item.id || `${item.title}-${index}`}
              ref={el => {
                plateRefs.current[index] = el;
              }}
              className="dolly-plate"
              onClick={e => {
                e.stopPropagation();
                if (onItemClick) {
                  onItemClick(item, index);
                } else {
                  goToIndex(index);
                }
              }}
            >
              <div className="dolly-plate-inner">
                {/* Poster Image */}
                <div className="dolly-plate-image-wrapper">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="dolly-plate-image"
                    draggable={false}
                  />
                  <div className="dolly-plate-gradient" />
                  {item.category && (
                    <span className="dolly-plate-category">{item.category}</span>
                  )}
                  <span className="dolly-plate-index">
                    #{index + 1} of {count}
                  </span>
                </div>

                {/* Poster Content */}
                <div className="dolly-plate-body">
                  <h4 className="dolly-plate-title">{item.title}</h4>
                  {item.description && (
                    <p className="dolly-plate-desc">{item.description}</p>
                  )}
                  <div className="dolly-plate-footer">
                    {item.date && (
                      <span className="dolly-plate-date">{item.date}</span>
                    )}
                    <span className="dolly-plate-hint">Click to expand &rarr;</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="dolly-gallery-controls">
        <button
          type="button"
          className="dolly-ctrl-btn"
          onClick={prev}
          aria-label="Previous poster"
          title="Previous poster"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
        </button>

        {/* Auto Flight Toggle */}
        <button
          type="button"
          className={`dolly-play-btn ${isPlaying ? 'is-active' : ''}`}
          onClick={() => setIsPlaying(p => !p)}
          title={isPlaying ? 'Pause 3D Flight' : 'Auto 3D Fly-Through'}
        >
          <HugeiconsIcon icon={isPlaying ? PauseIcon : PlayIcon} size={13} />
          <span>{isPlaying ? 'Pause Flight' : 'Auto Fly'}</span>
        </button>

        {/* Progress scrub dots */}
        <div className="dolly-scrub-dots">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`dolly-dot ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => {
                setIsPlaying(false);
                goToIndex(idx);
              }}
              title={`Jump to poster #${idx + 1}`}
              aria-label={`Jump to poster #${idx + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="dolly-ctrl-btn"
          onClick={next}
          aria-label="Next poster"
          title="Next poster"
        >
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        </button>
      </div>
    </div>
  );
}
