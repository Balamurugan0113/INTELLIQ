// frontend/src/components/ui/GradientCarousel.jsx
'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './GradientCarousel.css';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';

/**
 * GradientCarousel
 * React Bits Pro - 3D carousel that tints the background from each card
 */
export default function GradientCarousel({
  items = [],
  maxRotationDegrees = 26,
  maxDepthPx = 130,
  cardSpacing = 280,
  autoplay = true,
  delay = 4500,
  onItemClick,
  className = ''
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const rootRef = useRef(null);
  const dragRef = useRef({ startX: 0, isDragging: false });

  const count = items.length;

  const activeItem = useMemo(() => {
    return items[activeIndex] || items[0] || {};
  }, [items, activeIndex]);

  // Extract gradient colors for the active card
  const [color1, color2] = useMemo(() => {
    if (activeItem.gradient && activeItem.gradient.length >= 2) {
      return activeItem.gradient;
    }
    return ['#01cefc', '#ff3de8'];
  }, [activeItem]);

  const goTo = useCallback(
    index => {
      if (count === 0) return;
      const normalized = (index + count) % count;
      setActiveIndex(normalized);
    },
    [count]
  );

  const next = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const prev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  // Autoplay timer
  useEffect(() => {
    if (!autoplay || isHovered || count < 2) return;

    const timer = setInterval(() => {
      next();
    }, delay);

    return () => clearInterval(timer);
  }, [autoplay, isHovered, count, delay, next]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    e => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
    },
    [next, prev]
  );

  // Drag / swipe handlers
  const onPointerDown = e => {
    dragRef.current.startX = e.clientX;
    dragRef.current.isDragging = true;
  };

  const onPointerUp = e => {
    if (!dragRef.current.isDragging) return;
    dragRef.current.isDragging = false;
    const diff = e.clientX - dragRef.current.startX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) next();
      else prev();
    }
  };

  // Compute 3D transforms for card at index i relative to activeIndex
  const getCardStyle = index => {
    let offset = index - activeIndex;

    // Wrap around shortest distance in circular carousel
    if (offset > count / 2) offset -= count;
    if (offset < -count / 2) offset += count;

    const absOffset = Math.abs(offset);

    // Hide cards that are too far
    if (absOffset > 2) {
      return {
        visibility: 'hidden',
        opacity: 0,
        pointerEvents: 'none',
        transform: `translate3d(${offset > 0 ? 500 : -500}px, 0, -300px) scale(0.6)`
      };
    }

    const sign = Math.sign(offset);
    const translateX = offset * cardSpacing;
    const translateZ = -absOffset * maxDepthPx;
    const rotateY = -sign * Math.min(maxRotationDegrees * absOffset, maxRotationDegrees * 1.25);
    const scale = Math.pow(0.88, absOffset);
    const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.78 : 0.4;
    const zIndex = 50 - absOffset * 10;
    const filter = absOffset === 0 ? 'none' : `blur(${absOffset * 1.5}px) brightness(0.7)`;

    return {
      transform: `translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      filter,
      visibility: 'visible',
      pointerEvents: absOffset > 1 ? 'none' : 'auto'
    };
  };

  return (
    <div
      ref={rootRef}
      className={`gradient-carousel-root${className ? ` ${className}` : ''}`}
      tabIndex={0}
      role="region"
      aria-label="3D Gradient Carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        dragRef.current.isDragging = false;
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onKeyDown={handleKeyDown}
      style={{
        '--color-1': color1,
        '--color-2': color2,
        '--card-glow': `${color1}66`
      }}
    >
      {/* Ambient background tint that reacts dynamically to the active card */}
      <div
        className="gradient-carousel-ambient"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color1}55 0%, ${color2}33 45%, transparent 75%)`
        }}
      />

      {/* 3D Perspective Stage */}
      <div className="gradient-carousel-stage">
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const style = getCardStyle(index);

          return (
            <div
              key={item.id || `${item.title}-${index}`}
              className="gradient-carousel-card"
              data-active={isActive ? 'true' : 'false'}
              style={style}
              onClick={e => {
                e.stopPropagation();
                if (!isActive) {
                  goTo(index);
                }
              }}
            >
              <div className="gradient-card-inner">
                <img
                  src={item.image}
                  alt={item.title || `Poster ${index + 1}`}
                  className="gradient-card-img"
                  draggable={false}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="gradient-carousel-controls">
        <button
          type="button"
          className="gradient-ctrl-arrow prev"
          onClick={prev}
          aria-label="Previous card"
          title="Previous card"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </button>

        {/* Indicator dots */}
        <div className="gradient-indicator-dots">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`gradient-dot ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => goTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="gradient-ctrl-arrow next"
          onClick={next}
          aria-label="Next card"
          title="Next card"
        >
          <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
        </button>
      </div>
    </div>
  );
}
