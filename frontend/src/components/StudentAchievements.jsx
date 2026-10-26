import React, { useState, useMemo, useEffect } from 'react';
import './StudentAchievements.css';
import { getAchievements, subscribeData } from '../services/dataService';
import { FaTimes, FaSearchPlus, FaImages, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function StudentAchievements() {
  const [achievements, setAchievements] = useState(() => getAchievements());
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    return subscribeData(() => {
      setAchievements(getAchievements());
    });
  }, []);

  const galleryImages = achievements.length > 0 ? achievements : ['/Achievements/achievements_1.png'];

  // Duplicate image array for seamless infinite looping
  const loopImages = useMemo(() => {
    return [...galleryImages, ...galleryImages];
  }, [galleryImages]);

  const openGalleryModal = (index = 0) => {
    setActiveImgIndex(index % galleryImages.length);
    setGalleryOpen(true);
  };

  const closeGalleryModal = () => {
    setGalleryOpen(false);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="pure-gallery-section">
      {/* CONTINUOUS MARQUEE LOOP ANIMATION TRACK (LIKE LOGO LOOP) */}
      <div
        className={`gallery-marquee ${paused ? 'paused' : ''}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="gallery-marquee-track">
          {loopImages.map((imgSrc, idx) => (
            <div
              key={idx}
              className="gallery-marquee-item"
              onClick={() => openGalleryModal(idx)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openGalleryModal(idx);
                }
              }}
            >
              <img src={imgSrc} alt="" className="gallery-marquee-img" />
              <div className="gallery-img-hover-overlay">
                <FaSearchPlus className="gallery-zoom-icon" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VIEW MORE IMAGES BUTTON */}
      <div className="view-more-gallery-wrapper">
        <button
          type="button"
          className="view-more-images-btn"
          onClick={() => openGalleryModal(0)}
        >
          <FaImages style={{ marginRight: '8px' }} />
          View More Images ({galleryImages.length}) &rarr;
        </button>
      </div>

      {/* FULL GALLERY POPUP MODAL (ZERO TEXT WORDINGS) */}
      {galleryOpen && (
        <div className="lightbox-overlay" onClick={closeGalleryModal} role="dialog" aria-modal="true">
          <button className="lightbox-close-btn" onClick={closeGalleryModal} aria-label="Close Gallery">
            <FaTimes />
          </button>

          <button className="lightbox-nav-btn prev" onClick={prevImage} aria-label="Previous image">
            <FaChevronLeft />
          </button>

          <div className="lightbox-image-container" onClick={(e) => e.stopPropagation()}>
            <img
              src={galleryImages[activeImgIndex]}
              alt=""
              className="lightbox-full-img"
            />

            {/* THUMBNAIL STRIP TO VIEW ALL OTHER IMAGES */}
            <div className="lightbox-thumbnails-strip">
              {galleryImages.map((thumbSrc, tIdx) => (
                <div
                  key={tIdx}
                  className={`thumb-item ${tIdx === activeImgIndex ? 'active' : ''}`}
                  onClick={() => setActiveImgIndex(tIdx)}
                >
                  <img src={thumbSrc} alt="" />
                </div>
              ))}
            </div>
          </div>

          <button className="lightbox-nav-btn next" onClick={nextImage} aria-label="Next image">
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
