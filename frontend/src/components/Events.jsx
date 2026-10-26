// frontend/src/components/Events.jsx
import React, { useMemo, useRef, useState } from 'react';
import CardSwap, { Card } from './ui/CardSwap';
import './Events.css';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaTimes,
  FaExternalLinkAlt,
  FaImages
} from 'react-icons/fa';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Layers01Icon,
  Grid2X2Icon,
  SparklesIcon
} from '@hugeicons/core-free-icons';

/**
 * ============================================================================
 * REAL-TIME EVENTS DATA (AUTHORITATIVE SOURCE)
 * ============================================================================
 */
const REAL_EVENTS = [
  {
    id: '1',
    title: 'POWER BI - SESSION',
    date: '24/01/2026',
    time: '10:00 AM - 04:00 PM',
    venue: 'Seminar Hall, INFO INSTITUTE OF ENGINEERING',
    type: 'Session',
    description: 'Practical knowledge of Power BI for transforming raw data into interactive dashboards.',
    fullDetails:
      'Participants will gain practical knowledge of Power BI and learn how to transform raw data into meaningful insights through data visualization and interactive dashboards. The session will cover data import, data cleaning, data modeling, DAX basics, report creation, and dashboard development to support effective data-driven decision-making.',
    link: '#',
    images: [
      '/Events/PowerBi_1.png',
      '/Events/PowerBi_2.png',
      '/Events/PowerBi_3.png'
    ]
  },
  {
    id: '2',
    title: 'GITHUB - WORKSHOP',
    date: '24/01/2026',
    time: '10:00 AM - 04:00 PM',
    venue: 'Seminar Hall, INFO INSTITUTE OF ENGINEERING',
    type: 'Workshop',
    description: 'Introduction to version control, repositories, commits, branches, and pull requests.',
    fullDetails:
      'The GitHub Workshop introduced participants to version control and collaborative development. Participants gained practical exposure to repositories, commits, branches, pull requests, and project collaboration.',
    link: '#',
    images: ['/Events/Github_1.png', '/Events/Github_2.png']
  },
  {
    id: '3',
    title: 'RAG BASICS - SESSION',
    date: '28/01/2026',
    time: '10:00 AM - 04:00 PM',
    venue: 'Seminar Hall, INFO INSTITUTE OF ENGINEERING',
    type: 'Session',
    description: 'Fundamentals of Retrieval-Augmented Generation (RAG) and context-aware AI systems.',
    fullDetails:
      'The session introduced participants to the fundamentals of Retrieval-Augmented Generation (RAG), including how AI systems retrieve relevant information and generate context-aware responses.',
    link: '#',
    images: [
      '/Events/Rag_basics_1.png',
      '/Events/Rag_basics_2.png',
      '/Events/Rag_basics_3.png',
      '/Events/Rag_basics_4.png'
    ]
  },
  {
    id: '4',
    title: 'RPA - Build Your Own Automation Bot - Guest Lecture',
    date: '14/02/2026',
    time: '10:00 AM - 04:00 PM',
    venue: 'Seminar Hall, INFO INSTITUTE OF ENGINEERING',
    type: 'Guest Lecture',
    description: 'Insights into Robotic Process Automation (RPA) and automated bot creation.',
    fullDetails:
      'Participants will gain insights into Robotic Process Automation (RPA) and learn how automation bots can automate repetitive tasks efficiently. The session will cover RPA concepts, workflow automation, bot creation, and real-world applications.',
    link: '#',
    images: ['/Events/Rpa_1.png', '/Events/Rpa_2.png', '/Events/Rpa_3.png']
  },
  {
    id: '5',
    title: 'UiPath - Hands-on Training',
    date: '14/02/2026',
    time: '10:00 AM - 04:00 PM',
    venue: 'Seminar Hall, INFO INSTITUTE OF ENGINEERING',
    type: 'Hands-on',
    description: 'Practical training on UiPath to design automated workflows and automation solutions.',
    fullDetails:
      'Participants will explore UiPath through practical activities and learn how to design automated workflows, manage tasks, and create simple automation solutions. The session will provide an interactive introduction to building efficient automation using UiPath.',
    link: '#',
    images: ['/Events/uipath_1.png', '/Events/uipath_2.png', '/Events/uipath_3.png']
  },
  {
    id: '6',
    title: 'Placement Preparation - 6th Semester - Hands-on',
    date: '6th Sem 2026',
    time: '10:30 AM - 04:30 PM',
    venue: 'INFO INSTITUTE OF ENGINEERING',
    type: 'Hands-on',
    description: 'Placement preparation covering aptitude, technical skills, resume building, and interviews.',
    fullDetails:
      'A placement-focused session designed to help students prepare for upcoming recruitment opportunities. The session will cover aptitude, technical skills, communication, resume building, and interview preparation, helping students approach placements with greater confidence.',
    link: '#',
    images: ['/Events/Rag_1.png', '/Events/Rag_2.png', '/Events/Rag_3.png']
  },
  {
    id: '7',
    title: 'Industrial Visit - Soften Technologies',
    date: '27/02/2026 - 28/02/2026',
    time: 'Full-day',
    venue: 'Cochin',
    type: 'Industrial Visit',
    description: 'Practical industrial visit exploring real-world IT technologies and workplace practices.',
    fullDetails:
      'Students will gain industry exposure through a practical visit to Soften Technologies, exploring real-world technologies, workplace practices, and the application of technical skills in the IT industry.',
    link: '#',
    images: ['/Events/IV_1.png', '/Events/IV_2.png', '/Events/IV_3.png']
  },
  {
    id: '8',
    title: 'Industry Internship Program',
    date: 'July 2026',
    time: 'Full Duration',
    venue: 'Coimbatore',
    type: 'Internship',
    description: 'Practical industry experience through an internship program in Coimbatore.',
    fullDetails:
      'Students will gain practical industry experience through an internship program in Coimbatore, helping them apply their academic knowledge, develop technical skills, and understand real-world professional environments.',
    link: '#',
    images: ['/Events/Intern_1.png', '/Events/Intern_2.png']
  },
  {
    id: '9',
    title: 'SYMPOSIUM - INFEST 2K26',
    date: '22/02/2026',
    time: 'Full-day',
    venue: 'INFO INSTITUTE OF ENGINEERING',
    type: 'Symposium',
    description: 'Departmental technical symposium celebrating innovation, technology, and talent.',
    fullDetails:
      'A departmental symposium that brings together innovation, technology, and talent. INFEST 2K26 provides a platform for students to showcase their technical knowledge, creativity, and skills through exciting events, competitions, and interactive activities.',
    link: '#',
    images: ['/Events/Symp_1.png', '/Events/Symp_2.png', '/Events/Symp_3.png']
  }
];

export default function Events() {
  const [events] = useState(REAL_EVENTS);
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState('stack'); // 'stack' (CardSwap) or 'grid'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const cardSwapRef = useRef(null);

  // Extract unique chips dynamically from real-time events
  const chips = useMemo(() => {
    const types = Array.from(new Set(events.map(e => e.type)));
    return ['All', ...types];
  }, [events]);

  const show = useMemo(() => {
    if (filter === 'All') return events;
    return events.filter(e => e.type.toLowerCase() === filter.toLowerCase());
  }, [events, filter]);

  const openEventModal = ev => {
    setSelectedEvent(ev);
    setActiveImageIndex(0);
  };

  const closeEventModal = () => {
    setSelectedEvent(null);
  };

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
              Flagship & Real-Time Events
            </h3>
            <p className="events-description">
              Explore interactive workshops, industrial visits, guest lectures, and symposiums at INFO Institute of Engineering.
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
                onClick={() => setFilter(c)}
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
                    height={380}
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
                  >
                    {show.map((e, index) => {
                      const coverImage =
                        e.images && e.images.length > 0
                          ? e.images[0]
                          : 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80&auto=format&fit=crop';
                      const catSlug = e.type.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <Card
                          key={e.id || `${e.title}-${index}`}
                          className="event-swap-card"
                          onClick={() => openEventModal(e)}
                        >
                          <div className="event-card-swap-content">
                            <div className="event-card-swap-media">
                              <img src={coverImage} alt={e.title} draggable={false} />
                              <div className="event-card-swap-gradient-overlay" />
                              <span className={`event-card-swap-badge cat-${catSlug}`}>
                                {e.type}
                              </span>
                              <span className="event-card-swap-date-pill">{e.date}</span>
                            </div>

                            <div className="event-card-swap-body">
                              <div className="event-card-swap-meta">
                                <span className="event-card-swap-venue">
                                  <FaMapMarkerAlt className="meta-icon" />
                                  <span>{e.venue || 'INFO INSTITUTE OF ENGINEERING'}</span>
                                </span>
                                {e.time && (
                                  <span className="event-card-swap-time">
                                    <FaClock className="meta-icon" />
                                    <span>{e.time}</span>
                                  </span>
                                )}
                              </div>

                              <h4 className="event-card-swap-title">{e.title}</h4>
                              <p className="event-card-swap-desc">{e.description}</p>

                              <div className="event-card-swap-footer">
                                <button
                                  type="button"
                                  className="event-card-swap-btn"
                                  onClick={ev => {
                                    ev.stopPropagation();
                                    openEventModal(e);
                                  }}
                                >
                                  View Details &amp; Photos &rarr;
                                </button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
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
                      Drag or fling cards &bull; Click to open gallery &bull; Use arrows to swap
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
                  className="event-card"
                  tabIndex={0}
                  role="button"
                  aria-label={`${e.title} - Click for full details`}
                  onClick={() => openEventModal(e)}
                  onKeyDown={evt => {
                    if (evt.key === 'Enter' || evt.key === ' ') {
                      evt.preventDefault();
                      openEventModal(e);
                    }
                  }}
                >
                  <div className="card-top-bar">
                    <span className={`cat-badge cat-${e.type.toLowerCase().replace(/\s+/g, '-')}`}>
                      {e.type}
                    </span>
                    <span className="award-badge">{e.date}</span>
                  </div>

                  <h3 className="ach-title">{e.title}</h3>

                  <div className="ach-meta">
                    <div className="meta-item">
                      <FaMapMarkerAlt className="meta-icon" />
                      <span>{e.venue || 'INFO INSTITUTE OF ENGINEERING'}</span>
                    </div>
                    {e.time && (
                      <div className="meta-item">
                        <FaClock className="meta-icon" />
                        <span>{e.time}</span>
                      </div>
                    )}
                  </div>

                  {e.description && <p className="ach-desc">{e.description}</p>}

                  <div className="ach-card-footer">
                    <span className="view-details-btn">View Details &amp; Photos &rarr;</span>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>

      {/* EVENT DETAILS POPUP MODAL */}
      {selectedEvent && (
        <div className="event-modal-overlay" onClick={closeEventModal} role="dialog" aria-modal="true">
          <div className="event-modal-content" onClick={e => e.stopPropagation()}>
            <button className="event-modal-close" onClick={closeEventModal} aria-label="Close modal">
              <FaTimes />
            </button>

            <div className="event-modal-header">
              <span className="event-modal-badge">{selectedEvent.type}</span>
              <h2>{selectedEvent.title}</h2>
              <div className="event-modal-meta-row">
                {selectedEvent.date && (
                  <span>
                    <FaCalendarAlt /> {selectedEvent.date}
                  </span>
                )}
                {selectedEvent.time && (
                  <span>
                    <FaClock /> {selectedEvent.time}
                  </span>
                )}
                {selectedEvent.venue && (
                  <span>
                    <FaMapMarkerAlt /> {selectedEvent.venue}
                  </span>
                )}
              </div>
            </div>

            <div className="event-modal-body">
              <div className="event-description-box">
                <h3>About Event</h3>
                <p>{selectedEvent.fullDetails || selectedEvent.description}</p>
              </div>

              {/* EVENT PICTURES GALLERY */}
              {selectedEvent.images && selectedEvent.images.length > 0 && (
                <div className="event-gallery-box">
                  <h3>
                    <FaImages /> Event Gallery ({selectedEvent.images.length})
                  </h3>

                  {/* Main Preview Image */}
                  <div className="gallery-main-preview">
                    <img
                      src={selectedEvent.images[activeImageIndex]}
                      alt={`${selectedEvent.title} photo ${activeImageIndex + 1}`}
                      className="main-gallery-img"
                    />
                  </div>

                  {/* Thumbnails */}
                  {selectedEvent.images.length > 1 && (
                    <div className="gallery-thumbnails">
                      {selectedEvent.images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`thumb-btn ${idx === activeImageIndex ? 'active' : ''}`}
                          onClick={() => setActiveImageIndex(idx)}
                        >
                          <img src={img} alt={`Thumbnail ${idx + 1}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedEvent.link && selectedEvent.link !== '#' && (
                <div className="event-modal-footer">
                  <a
                    href={selectedEvent.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="event-register-btn"
                  >
                    Register / Learn More <FaExternalLinkAlt style={{ marginLeft: '6px' }} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
