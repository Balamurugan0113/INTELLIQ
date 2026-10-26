// frontend/src/components/Events.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import CardSwap, { Card } from './ui/CardSwap';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Layers01Icon,
  Grid2X2Icon,
  AiBrain01Icon,
  SparklesIcon
} from '@hugeicons/core-free-icons';
import './Events.css';

// Default / fallback events with high quality imagery and metadata
const DEFAULT_EVENTS = [
  {
    id: '1',
    title: 'Intro to Transformers & LLMs',
    date: '2025-12-12',
    type: 'Workshop',
    description: 'Hands-on exploration of self-attention mechanisms, HuggingFace pipelines, and fine-tuning neural architectures.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&q=80&auto=format&fit=crop',
    link: '#'
  },
  {
    id: '2',
    title: 'Data Viz & Intelligence Night',
    date: '2026-01-08',
    type: 'Talk',
    description: 'From raw telemetry to remarkable dashboards: building high-impact real-time analytics for intelligent systems.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop',
    link: '#'
  },
  {
    id: '3',
    title: 'INTELLIQ Hack 2.0',
    date: '2026-02-21',
    type: 'Hackathon',
    description: '48-hour sprint building autonomous agents, multimodal workflows, and cutting-edge intelligence tools.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&q=80&auto=format&fit=crop',
    link: '#'
  },
  {
    id: '4',
    title: 'Autonomous Multi-Agent Systems',
    date: '2026-03-15',
    type: 'Workshop',
    description: 'Architecting coordinated agent pipelines with tool execution, memory graphs, and automated code review.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=80&auto=format&fit=crop',
    link: '#'
  }
];

const TYPE_IMAGE_FALLBACKS = {
  Workshop: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&q=80&auto=format&fit=crop',
  Talk: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop',
  Hackathon: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&q=80&auto=format&fit=crop',
  Default: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80&auto=format&fit=crop'
};

// Smooth 3D tilt helpers for grid view cards
function handleCardMouseMove(ev) {
  const card = ev.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = (ev.clientX - rect.left) / rect.width;
  const y = (ev.clientY - rect.top) / rect.height;

  const rotateX = (0.5 - y) * 10;
  const rotateY = (x - 0.5) * 16;

  if (card.__tiltRaf) cancelAnimationFrame(card.__tiltRaf);
  card.__tiltRaf = requestAnimationFrame(() => {
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
}

function handleCardMouseLeave(ev) {
  const card = ev.currentTarget;
  if (card.__tiltRaf) {
    cancelAnimationFrame(card.__tiltRaf);
    card.__tiltRaf = null;
  }
  card.style.transition = 'transform 200ms ease-out';
  card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
  setTimeout(() => {
    card.style.transition = '';
  }, 220);
}

export default function Events({ apiBase }) {
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState('stack'); // 'stack' (CardSwap) or 'grid'
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const cardSwapRef = useRef(null);

  useEffect(() => {
    if (!apiBase) return;
    fetch(`${apiBase}/api/events`)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(d => {
        if (Array.isArray(d) && d.length) {
          // enrich backend events with fallback images if missing
          const enriched = d.map(item => ({
            ...item,
            image: item.image || TYPE_IMAGE_FALLBACKS[item.type] || TYPE_IMAGE_FALLBACKS.Default
          }));
          setEvents(enriched);
        }
      })
      .catch(() => {
        // Fallback to default rich events
      });
  }, [apiBase]);

  const show = useMemo(() => {
    if (filter === 'All') return events;
    return events.filter(e => e.type?.toLowerCase() === filter.toLowerCase());
  }, [events, filter]);

  const chips = ['All', 'Workshop', 'Talk', 'Hackathon'];

  const handlePrev = () => {
    cardSwapRef.current?.prev();
  };

  const handleNext = () => {
    cardSwapRef.current?.next();
  };

  return (
    <section aria-labelledby="events-heading" className="events-section">
      <div className="events-container">
        {/* Header Bar: Title, Subtitle, and View Mode Switcher */}
        <div className="events-header-bar">
          <div className="events-heading-group">
            <h3 id="events-heading" className="events-subheading">
              <HugeiconsIcon icon={SparklesIcon} size={18} className="events-heading-icon" />
              Flagship & Upcoming Sessions
            </h3>
            <p className="events-description">
              Explore interactive workshops, hackathons, and technical talks driving innovation at INTELLIQ.
            </p>
          </div>

          <div className="events-view-switcher" role="group" aria-label="View mode toggle">
            <button
              type="button"
              className={`view-switch-btn ${viewMode === 'stack' ? 'is-active' : ''}`}
              onClick={() => setViewMode('stack')}
              title="3D Card Swap Stack"
              aria-pressed={viewMode === 'stack'}
            >
              <HugeiconsIcon icon={Layers01Icon} size={15} />
              <span>Stack</span>
            </button>
            <button
              type="button"
              className={`view-switch-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
              aria-pressed={viewMode === 'grid'}
            >
              <HugeiconsIcon icon={Grid2X2Icon} size={15} />
              <span>Grid</span>
            </button>
          </div>
        </div>

        {/* Filters row */}
        <div className="events-filters-row">
          <div className="event-filters">
            {chips.map(c => (
              <button
                key={c}
                type="button"
                className={`event-filter-btn ${filter === c ? 'is-active' : ''}`}
                aria-pressed={filter === c}
                onClick={() => {
                  setFilter(c);
                  setActiveCardIndex(0);
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode: CardSwap 3D Stack */}
        {viewMode === 'stack' && (
          <div className="events-swap-showcase">
            {show.length === 0 ? (
              <div className="events-empty">No events found in this category.</div>
            ) : (
              <>
                <div className="events-swap-wrapper">
                  <CardSwap
                    ref={cardSwapRef}
                    key={filter}
                    width={460}
                    height={360}
                    cardDistance={55}
                    verticalDistance={65}
                    depth={85}
                    skewAmount={5}
                    delay={4500}
                    autoplay={true}
                    pauseOnHover={true}
                    draggable={true}
                    speed={1}
                    theme="dark"
                    onChange={index => setActiveCardIndex(index)}
                  >
                    {show.map((e, index) => (
                      <Card key={e.id || `${e.title}-${index}`} className="event-swap-card">
                        <div className="event-card-swap-content">
                          <div className="event-card-swap-media">
                            <img
                              src={e.image || TYPE_IMAGE_FALLBACKS[e.type] || TYPE_IMAGE_FALLBACKS.Default}
                              alt={e.title}
                              draggable={false}
                            />
                            <div className="event-card-swap-gradient-overlay" />
                            <span className={`event-card-swap-badge badge-${(e.type || 'talk').toLowerCase()}`}>
                              {e.type}
                            </span>
                          </div>

                          <div className="event-card-swap-body">
                            <div className="event-card-swap-meta">
                              <span className="event-card-swap-date">
                                <HugeiconsIcon icon={Calendar01Icon} size={14} />
                                {e.date
                                  ? new Date(e.date).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })
                                  : 'Upcoming'}
                              </span>
                              <span className="event-card-swap-counter">
                                #{index + 1} of {show.length}
                              </span>
                            </div>

                            <h4 className="event-card-swap-title">{e.title}</h4>
                            <p className="event-card-swap-desc">{e.description}</p>

                            <div className="event-card-swap-footer">
                              <a
                                href={e.link || '#events'}
                                className="event-card-swap-btn"
                                onClick={ev => {
                                  if (!e.link || e.link === '#') {
                                    ev.preventDefault();
                                  }
                                }}
                              >
                                View Details &rarr;
                              </a>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </CardSwap>
                </div>

                {/* CardSwap Interactive Controls Bar */}
                <div className="events-swap-controls">
                  <button
                    type="button"
                    className="swap-nav-btn prev"
                    onClick={handlePrev}
                    aria-label="Previous event card"
                    title="Previous card"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
                  </button>

                  <div className="swap-indicator">
                    <span className="swap-indicator-text">
                      Drag or fling cards &bull; Use arrows to swap
                    </span>
                  </div>

                  <button
                    type="button"
                    className="swap-nav-btn next"
                    onClick={handleNext}
                    aria-label="Next event card"
                    title="Next card"
                  >
                    <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* View Mode: Classic Cards Grid */}
        {viewMode === 'grid' && (
          <div className="events-grid">
            {show.length === 0 ? (
              <div className="events-empty">No events found in this category.</div>
            ) : (
              show.map(e => (
                <article
                  key={e.id}
                  className="card event-card"
                  data-type={e.type}
                  role="article"
                  aria-label={e.title}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <div className="event-grid-media">
                    <img
                      src={e.image || TYPE_IMAGE_FALLBACKS[e.type] || TYPE_IMAGE_FALLBACKS.Default}
                      alt={e.title}
                      className="event-grid-img"
                    />
                    <span className="badge">{e.type}</span>
                  </div>
                  <div className="event-grid-content">
                    <h3>{e.title}</h3>
                    <div className="meta">
                      <HugeiconsIcon icon={Calendar01Icon} size={13} style={{ marginRight: '5px' }} />
                      {new Date(e.date).toDateString()}
                    </div>
                    <p>{e.description}</p>
                    <div className="event-grid-footer">
                      <a href={e.link || '#'} className="event-grid-link">
                        Learn More &rarr;
                      </a>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
