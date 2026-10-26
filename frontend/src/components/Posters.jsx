// frontend/src/components/Posters.jsx
import React, { useState, useEffect } from 'react';
import GradientCarousel from './ui/GradientCarousel';
import './Posters.css';
import { getPosters, subscribeData } from '../services/dataService';
import { INITIAL_POSTERS } from '../data/initialData';

export const POSTERS_DATA = INITIAL_POSTERS;

export default function Posters() {
  const [posters, setPosters] = useState(() => getPosters());

  useEffect(() => {
    return subscribeData(() => {
      setPosters(getPosters());
    });
  }, []);

  return (
    <section aria-label="Posters" className="posters-section">
      <div className="posters-container">
        {/* 3D Gradient Carousel (Tints the background from each card) */}
        <GradientCarousel
          key={posters.length}
          items={posters}
          maxRotationDegrees={26}
          maxDepthPx={130}
          cardSpacing={280}
          autoplay={true}
          delay={4500}
        />
      </div>
    </section>
  );
}
