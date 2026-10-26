// frontend/src/components/Posters.jsx
import React, { useState, useMemo } from 'react';
import GradientCarousel from './ui/GradientCarousel';
import './Posters.css';
import { FaTimes, FaExternalLinkAlt, FaCalendarAlt } from 'react-icons/fa';

export const POSTERS_DATA = [
  {
    id: 'poster-1',
    title: 'POWER BI - HANDS-ON SESSION',
    category: 'Workshop',
    date: '24/01/2026',
    image: '/Events/PowerBi_1.png',
    gradient: ['#00d2ff', '#0078d4'],
    description: 'Transforming raw data into meaningful business intelligence dashboards and interactive analytics.',
    fullDetails: 'The Power BI masterclass provided hands-on training for students to master data modeling, DAX queries, and dashboard storytelling for real-world business analytics.'
  },
  {
    id: 'poster-2',
    title: 'GITHUB - COLLABORATIVE WORKSHOP',
    category: 'Workshop',
    date: '24/01/2026',
    image: '/Events/Github_1.png',
    gradient: ['#6366f1', '#a855f7'],
    description: 'Mastering modern version control, repository workflows, branch management, and open-source collaboration.',
    fullDetails: 'Participants engaged in collaborative git practices including pull request reviews, rebasing, merge conflict resolution, and GitHub Actions CI/CD pipelines.'
  },
  {
    id: 'poster-3',
    title: 'RETRIEVAL-AUGMENTED GENERATION (RAG)',
    category: 'AI & Data',
    date: '28/01/2026',
    image: '/Events/Rag_basics_1.png',
    gradient: ['#00f2fe', '#4facfe'],
    description: 'Context-aware intelligence architectures combining vector databases with large language models.',
    fullDetails: 'Deep dive into retrieval pipelines, embedding chunking strategies, semantic search, and grounding AI agent responses with authoritative institutional knowledge.'
  },
  {
    id: 'poster-4',
    title: 'RPA - BUILD YOUR OWN AUTOMATION BOT',
    category: 'Automation',
    date: '14/02/2026',
    image: '/Events/Rpa_1.png',
    gradient: ['#ff0844', '#ffb199'],
    description: 'Guest lecture and live bot building covering end-to-end Robotic Process Automation pipelines.',
    fullDetails: 'Students discovered how autonomous software bots execute repetitive business tasks across enterprise systems, error handling, and orchestrator triggers.'
  },
  {
    id: 'poster-5',
    title: 'UiPath - HANDS-ON AUTOMATION TRAINING',
    category: 'Hands-on',
    date: '14/02/2026',
    image: '/Events/uipath_1.png',
    gradient: ['#fa709a', '#fee140'],
    description: 'Interactive workflow automation design, desktop recording, and bot deployment using UiPath Studio.',
    fullDetails: 'An interactive session introducing robotic process automation patterns, custom activity packages, and workflow scheduling for enterprise automation.'
  },
  {
    id: 'poster-6',
    title: 'INFEST 2K26 - NATIONAL TECHNICAL SYMPOSIUM',
    category: 'Symposium',
    date: '22/02/2026',
    image: '/Events/Symp_1.png',
    gradient: ['#f72585', '#7209b7'],
    description: 'Annual flagship symposium showcasing coding championships, project expos, technical presentations, and talent.',
    fullDetails: 'The flagship departmental festival bringing together engineering colleges across the state for competitive coding, hack sprints, paper presentations, and robotics.'
  },
  {
    id: 'poster-7',
    title: 'INDUSTRIAL VISIT - SOFTEN TECHNOLOGIES',
    category: 'Industrial',
    date: '27/02/2026 - 28/02/2026',
    image: '/Events/IV_1.png',
    gradient: ['#00c6ff', '#0072ff'],
    description: 'On-site industrial learning expedition to Cochin exploring live cloud environments and enterprise IT culture.',
    fullDetails: 'Students experienced firsthand how commercial software architectures are managed, monitored, and scaled in high-availability production cloud clusters.'
  },
  {
    id: 'poster-8',
    title: 'INDUSTRY INTERNSHIP PROGRAM 2026',
    category: 'Internship',
    date: 'July 2026',
    image: '/Events/Intern_1.png',
    gradient: ['#43e97b', '#38f9d7'],
    description: 'Immersive corporate engineering internships providing real-world development experience in Coimbatore.',
    fullDetails: 'Comprehensive internship cohort placing students alongside senior developers to build production client applications and gain invaluable software engineering competence.'
  },
  {
    id: 'poster-9',
    title: 'EXCELLENCE & INNOVATION MILESTONE',
    category: 'Achievement',
    date: '2026',
    image: '/Achievements/Achievements_1.png',
    gradient: ['#f857a6', '#ff5858'],
    description: 'Honoring outstanding performance, awards, and technical triumphs achieved by INTELLIQ students.',
    fullDetails: 'Celebrating prestigious recognitions won at national conferences, hackathons, and symposiums by our dedicated student innovators.'
  },
  {
    id: 'poster-10',
    title: 'NATIONAL HACKATHON CHAMPIONSHIP',
    category: 'Achievement',
    date: '2026',
    image: '/Achievements/Achievements_2.png',
    gradient: ['#f12711', '#f5af19'],
    description: 'First prize and championship laurels earned in competitive rapid-prototyping tournaments.',
    fullDetails: 'Our student teams secured top honors for developing autonomous AI systems solving pressing industrial challenges in 36-hour non-stop hackathons.'
  }
];

export default function Posters() {
  const [filter, setFilter] = useState('All');
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

        {/* 3D Gradient Carousel (Tints the background from each card) */}
        <GradientCarousel
          key={filter}
          items={filteredPosters}
          maxRotationDegrees={26}
          maxDepthPx={130}
          cardSpacing={280}
          autoplay={true}
          delay={4500}
          onItemClick={poster => openPoster(poster)}
        />
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
