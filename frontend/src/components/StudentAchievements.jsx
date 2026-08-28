import React, { useState, useMemo } from 'react';
import './StudentAchievements.css';
import { ACHIEVEMENT_IMAGES } from '../data/achievementsData';
import { FaTimes, FaSearchPlus, FaImages, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Dynamically discover all images inside frontend/public/Achievements/ folder
const folderImageFiles = Object.keys(
  import.meta.glob('/public/Achievements/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,svg,gif}', { eager: true })
).map((path) => path.replace('/public', ''));

// Use folder images if present, otherwise fallback to ACHIEVEMENT_IMAGES array or default logos
const ALL_GALLERY_IMAGES = folderImageFiles.length > 0
  ? folderImageFiles
  : (ACHIEVEMENT_IMAGES.length > 0
      ? ACHIEVEMENT_IMAGES
      : ['/hero-image.png', '/logos/logo1.png', '/logos/logo2.png', '/logos/logo3.png', '/logos/logo4.png', '/logos/logo5.png']);

export default function StudentAchievements() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Duplicate image array for seamless infinite looping
  const loopImages = useMemo(() => {
    return [...ALL_GALLERY_IMAGES, ...ALL_GALLERY_IMAGES];
  }, []);

  const openGalleryModal = (index = 0) => {
    setActiveImgIndex(index % ALL_GALLERY_IMAGES.length);
    setGalleryOpen(true);
  };

  const closeGalleryModal = () => {
    setGalleryOpen(false);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === 0 ? ALL_GALLERY_IMAGES.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === ALL_GALLERY_IMAGES.length - 1 ? 0 : prev + 1));
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
          View More Images ({ALL_GALLERY_IMAGES.length}) &rarr;
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
              src={ALL_GALLERY_IMAGES[activeImgIndex]}
              alt=""
              className="lightbox-full-img"
            />

            {/* THUMBNAIL STRIP TO VIEW ALL OTHER IMAGES */}
            <div className="lightbox-thumbnails-strip">
              {ALL_GALLERY_IMAGES.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  className={`modal-thumb-btn ${i === activeImgIndex ? 'active' : ''}`}
                  onClick={() => setActiveImgIndex(i)}
                >
                  <img src={src} alt="" />
                </button>
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
