// frontend/src/components/Posters.jsx
import React, { useState, useMemo } from 'react';
import DollyGallery from './ui/DollyGallery';
import './Posters.css';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Layers01Icon,
  Grid2X2Icon,
  SparklesIcon,
  ArrowRight01Icon
} from '@hugeicons/core-free-icons';
import { FaTimes, FaExternalLinkAlt, FaCalendarAlt } from 'react-icons/fa';

export const POSTERS_DATA = [
  {
    id: 'poster-1',
    title: 'POWER BI - HANDS-ON SESSION',
    category: 'Workshop',
    date: '24/01/2026',
    image: '/Events/PowerBi_1.png',
    description: 'Transforming raw data into meaningful business intelligence dashboards and interactive analytics.',
    fullDetails: 'The Power BI masterclass provided hands-on training for students to master data modeling, DAX queries, and dashboard storytelling for real-world business analytics.'
  },
  {
    id: 'poster-2',
    title: 'GITHUB - COLLABORATIVE WORKSHOP',
    category: 'Workshop',
    date: '24/01/2026',
    image: '/Events/Github_1.png',
    description: 'Mastering modern version control, repository workflows, branch management, and open-source collaboration.',
    fullDetails: 'Participants engaged in collaborative git practices including pull request reviews, rebasing, merge conflict resolution, and GitHub Actions CI/CD pipelines.'
  },
  {
    id: 'poster-3',
    title: 'RETRIEVAL-AUGMENTED GENERATION (RAG)',
    category: 'AI & Data',
    date: '28/01/2026',
    image: '/Events/Rag_basics_1.png',
    description: 'Context-aware intelligence architectures combining vector databases with large language models.',
    fullDetails: 'Deep dive into retrieval pipelines, embedding chunking strategies, semantic search, and grounding AI agent responses with authoritative institutional knowledge.'
  },
  {
    id: 'poster-4',
    title: 'RPA - BUILD YOUR OWN AUTOMATION BOT',
    category: 'Automation',
    date: '14/02/2026',
    image: '/Events/Rpa_1.png',
    description: 'Guest lecture and live bot building covering end-to-end Robotic Process Automation pipelines.',
    fullDetails: 'Students discovered how autonomous software bots execute repetitive business tasks across enterprise systems, error handling, and orchestrator triggers.'
  },
  {
    id: 'poster-5',
    title: 'UiPath - HANDS-ON AUTOMATION TRAINING',
    category: 'Hands-on',
    date: '14/02/2026',
    image: '/Events/uipath_1.png',
    description: 'Interactive workflow automation design, desktop recording, and bot deployment using UiPath Studio.',
    fullDetails: 'An interactive session introducing robotic process automation patterns, custom activity packages, and workflow scheduling for enterprise automation.'
  },
  {
    id: 'poster-6',
    title: 'INFEST 2K26 - NATIONAL TECHNICAL SYMPOSIUM',
    category: 'Symposium',
    date: '22/02/2026',
    image: '/Events/Symp_1.png',
    description: 'Annual flagship symposium showcasing coding championships, project expos, technical presentations, and talent.',
    fullDetails: 'The flagship departmental festival bringing together engineering colleges across the state for competitive coding, hack sprints, paper presentations, and robotics.'
  },
  {
    id: 'poster-7',
    title: 'INDUSTRIAL VISIT - SOFTEN TECHNOLOGIES',
    category: 'Industrial',
    date: '27/02/2026 - 28/02/2026',
    image: '/Events/IV_1.png',
    description: 'On-site industrial learning expedition to Cochin exploring live cloud environments and enterprise IT culture.',
    fullDetails: 'Students experienced firsthand how commercial software architectures are managed, monitored, and scaled in high-availability production cloud clusters.'
  },
  {
    id: 'poster-8',
    title: 'INDUSTRY INTERNSHIP PROGRAM 2026',
    category: 'Internship',
    date: 'July 2026',
    image: '/Events/Intern_1.png',
    description: 'Immersive corporate engineering internships providing real-world development experience in Coimbatore.',
    fullDetails: 'Comprehensive internship cohort placing students alongside senior developers to build production client applications and gain invaluable software engineering competence.'
  },
  {
    id: 'poster-9',
    title: 'EXCELLENCE & INNOVATION MILESTONE',
    category: 'Achievement',
    date: '2026',
    image: '/Achievements/Achievements_1.png',
    description: 'Honoring outstanding performance, awards, and technical triumphs achieved by INTELLIQ students.',
    fullDetails: 'Celebrating prestigious recognitions won at national conferences, hackathons, and symposiums by our dedicated student innovators.'
  },
  {
    id: 'poster-10',
    title: 'NATIONAL HACKATHON CHAMPIONSHIP',
    category: 'Achievement',
    date: '2026',
    image: '/Achievements/Achievements_2.png',
    description: 'First prize and championship laurels earned in competitive rapid-prototyping tournaments.',
    fullDetails: 'Our student teams secured top honors for developing autonomous AI systems solving pressing industrial challenges in 36-hour non-stop hackathons.'
  }
];

export default function Posters() {
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState('dolly'); // 'dolly' (3D Fly-Through) or 'grid' (Wall)
  const [selectedPoster, setSelectedPoster] = useState(null);

  const chips = useMemo(() => {
    const categories = Array.from(new Set(POSTERS_DATA.map(p => p.category)));
    return ['All', ...categories];
  }, []);

  const filteredPosters = useMemo(() => {
    if (filter === 'All') return POSTERS_DATA;
    return POSTERS_DATA.filter(p => p.category.toLowerCase() === filter.toLowerCase());
  }, [filter]);

  const openPoster = poster => {
    setSelectedPoster(poster);
  };

  const closePoster = () => {
    setSelectedPoster(null);
  };

  return (
    <section aria-labelledby="posters-heading" className="posters-section">
      <div className="posters-container">
        {/* Header Bar */}
        <div className="posters-header-bar">
          <div className="posters-heading-group">
            <h3 id="posters-heading" className="posters-subheading">
              <HugeiconsIcon icon={SparklesIcon} size={18} className="posters-heading-icon" />
              Event &amp; Innovation Posters
            </h3>
            <p className="posters-description">
              Fly through stacked 3D depth to browse workshops, symposium announcements, industrial visits, and milestones.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="posters-view-switcher" role="group" aria-label="Poster display mode">
            <button
              type="button"
              className={`posters-switch-btn ${viewMode === 'dolly' ? 'is-active' : ''}`}
              onClick={() => setViewMode('dolly')}
              title="3D Dolly Fly-Through Gallery"
              aria-pressed={viewMode === 'dolly'}
            >
              <HugeiconsIcon icon={Layers01Icon} size={15} />
              <span>3D Fly-Through</span>
            </button>
            <button
              type="button"
              className={`posters-switch-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Poster Wall View"
              aria-pressed={viewMode === 'grid'}
            >
              <HugeiconsIcon icon={Grid2X2Icon} size={15} />
              <span>Poster Wall</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="posters-filters-row">
          <div className="poster-filters">
            {chips.map(c => (
              <button
                key={c}
                type="button"
                className={`poster-filter-btn ${filter === c ? 'is-active' : ''}`}
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Dolly Zoom / Gallery View */}
        {viewMode === 'dolly' && (
          <DollyGallery
            key={filter}
            items={filteredPosters}
            depthSpacing={700}
            perspective={1000}
            speed={1.1}
            onItemClick={poster => openPoster(poster)}
          />
        )}

        {/* Classic Wall Grid View */}
        {viewMode === 'grid' && (
          <div className="posters-grid-view">
            {filteredPosters.map((poster, idx) => (
              <article
                key={poster.id || idx}
                className="poster-wall-card"
                onClick={() => openPoster(poster)}
                tabIndex={0}
                role="button"
                aria-label={`View ${poster.title}`}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openPoster(poster);
                  }
                }}
              >
                <div className="poster-wall-media">
                  <img src={poster.image} alt={poster.title} loading="lazy" />
                  <span className="poster-wall-badge">{poster.category}</span>
                </div>
                <div className="poster-wall-body">
                  <h4 className="poster-wall-title">{poster.title}</h4>
                  <p className="poster-wall-desc">{poster.description}</p>
                  <div className="poster-wall-footer">
                    <span className="poster-wall-date">{poster.date}</span>
                    <span className="poster-wall-action">View Poster &rarr;</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Poster Modal */}
      {selectedPoster && (
        <div
          className="poster-modal-overlay"
          onClick={closePoster}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="poster-modal-dialog"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              className="poster-modal-close-btn"
              onClick={closePoster}
              aria-label="Close poster view"
            >
              <FaTimes />
            </button>

            <div className="poster-modal-image-container">
              <img
                src={selectedPoster.image}
                alt={selectedPoster.title}
              />
            </div>

            <div className="poster-modal-content">
              <span className="poster-modal-badge">{selectedPoster.category}</span>
              <h2 className="poster-modal-title">{selectedPoster.title}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#01cefc', fontSize: '0.88rem', fontWeight: 600 }}>
                <FaCalendarAlt />
                <span>{selectedPoster.date}</span>
              </div>
              <p className="poster-modal-desc">
                {selectedPoster.fullDetails || selectedPoster.description}
              </p>

              <div className="poster-modal-actions">
                <a
                  href={selectedPoster.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="poster-modal-link-btn"
                >
                  Open Full Image <FaExternalLinkAlt size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
