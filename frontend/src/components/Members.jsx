import React, { useEffect, useState } from 'react';
import './Members.css';
import {
  ACADEMIC_COORDINATORS,
  STAFF_COORDINATORS_BY_BATCH,
  BOARD_MEMBERS_BY_BATCH,
} from '../data/membersData';

import { FaGraduationCap, FaUserTie, FaUsers } from 'react-icons/fa';

export const SAMPLE = BOARD_MEMBERS_BY_BATCH['2026-27'];

const USE_API = (import.meta.env.VITE_USE_API_MEMBERS ?? 'true') !== 'false';

const toExternal = (url) => {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url.replace(/^\/+/, '')}`;
};

const resolveAvatar = (src) => {
  if (!src) return '';
  if (/^https?:\/\//i.test(src)) return src;
  const normalized = src.startsWith('/') ? src : `/avatars/${src}`;
  return normalized.replace(/ /g, '%20');
};

const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() || '')
    .join('');

export default function Members({ apiBase = '' }) {
  const [selectedBatch, setSelectedBatch] = useState('2026-27');
  const [members, setMembers] = useState(BOARD_MEMBERS_BY_BATCH['2026-27']);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // Update members when selected batch changes or API fetches
  useEffect(() => {
    const baseList = BOARD_MEMBERS_BY_BATCH[selectedBatch] || [];
    if (!USE_API || !apiBase) {
      setMembers(sortById(baseList));
      return;
    }

    fetch(`${apiBase}/api/members?batch=${selectedBatch}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (!Array.isArray(d) || !d.length) {
          setMembers(sortById(baseList));
          return;
        }
        const byName = Object.fromEntries(
          baseList.map((m) => [m.name.trim().toLowerCase(), m])
        );
        const merged = d.map((m) => {
          const key = (m.name || '').trim().toLowerCase();
          const base = byName[key] || {};
          return {
            ...base,
            ...m,
            avatar: m.avatar || base.avatar || '',
            linkedin: toExternal(m.linkedin || base.linkedin || ''),
            github: toExternal(m.github || base.github || ''),
          };
        });
        setMembers(sortById(merged));
      })
      .catch(() => {
        setMembers(sortById(baseList));
      });
  }, [apiBase, selectedBatch]);

  function sortById(list) {
    return [...list].sort((a, b) => {
      const ai = parseInt((a.id || '').replace(/\D/g, ''), 10) || 0;
      const bi = parseInt((b.id || '').replace(/\D/g, ''), 10) || 0;
      if (ai !== bi) return ai - bi;
      return (a.name || '').localeCompare(b.name || '');
    });
  }

  const openModal = (member) => {
    setSelected(member);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
  };

  const onCardKey = (e, m) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(m);
    }
  };

  const staffCoordinators = STAFF_COORDINATORS_BY_BATCH[selectedBatch] || [];

  return (
    <section id="members" className="section members-section" aria-labelledby="members-heading">
      <div className="container">

        {/* 1. ACADEMICS COORDINATORS SECTION */}
        <div className="coordinators-block">
          <div className="out-of-the-box-heading">
            <FaGraduationCap className="ootb-icon" />
            <h3 className="section-subheading neon-heading">Academics Coordinators</h3>
          </div>
          <div className="academic-grid">
            {ACADEMIC_COORDINATORS.map((ac) => {
              const avatar = resolveAvatar(ac.avatar);
              return (
                <div key={ac.id} className="academic-card glass-panel">
                  <div className="academic-avatar-wrapper">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={ac.name}
                        className="academic-avatar"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="avatar-fallback-center">{initials(ac.name)}</div>
                    )}
                  </div>
                  <div className="academic-info">
                    <h4 className="academic-name">{ac.name}</h4>
                    <span className="academic-position-badge">{ac.position}</span>
                    <p className="academic-message">&ldquo;{ac.message}&rdquo;</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. BATCH SWITCHER & STAFF COORDINATORS SECTION */}
        <div className="coordinators-block staff-section-header">
          <div className="staff-header-flex">
            <div className="out-of-the-box-heading">
              <FaUserTie className="ootb-icon" />
              <h3 className="section-subheading neon-heading">Staff Coordinators</h3>
            </div>
            
            {/* Batch Switcher Buttons */}
            <div className="batch-switcher" role="group" aria-label="Select Batch Year">
              <span className="batch-label">Batch:</span>
              {['2025-26', '2026-27'].map((batch) => (
                <button
                  key={batch}
                  type="button"
                  className={`batch-btn ${selectedBatch === batch ? 'active' : ''}`}
                  onClick={() => setSelectedBatch(batch)}
                >
                  Batch {batch}
                </button>
              ))}
            </div>
          </div>

          <div className="staff-grid">
            {staffCoordinators.map((sc) => {
              const avatar = resolveAvatar(sc.avatar);
              return (
                <div key={sc.id} className="staff-card glass-panel">
                  <div className="staff-avatar-wrapper">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={sc.name}
                        className="staff-avatar"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="avatar-fallback-center">{initials(sc.name)}</div>
                    )}
                  </div>
                  <div className="staff-info">
                    <h4 className="staff-name">{sc.name}</h4>
                    <span className="staff-position">{sc.position}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. STUDENT BOARD MEMBERS SECTION */}
        <div className="coordinators-block">
          <div className="out-of-the-box-heading">
            <FaUsers className="ootb-icon" />
            <h3 className="section-subheading neon-heading">
              Student Board Members <span className="batch-tag">({selectedBatch})</span>
            </h3>
          </div>

          <div className="members-grid" role="list">
            {members.map((m) => {
              const avatar = resolveAvatar(m.avatar);
              return (
                <article
                  key={m.id || m.name}
                  className="member-card centered sparkle-border-card"
                  role="listitem"
                  aria-label={`${m.name} — ${m.role}`}
                >
                  <div className="avatar-center">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={`${m.name} avatar`}
                        className="avatar-img-center"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                        loading="lazy"
                      />
                    ) : (
                      <div className="avatar-fallback-center">
                        {initials(m.name)}
                      </div>
                    )}
                  </div>

                  <div className="meta-center">
                    <div className="member-name-neon" aria-hidden="false">
                      {m.name}
                    </div>
                    <div className="member-role-glass">{m.role}</div>

                    <div className="links-center" aria-hidden="false">
                      {m.linkedin && (
                        <a
                          className="icon-chip"
                          href={m.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          LinkedIn
                        </a>
                      )}
                      {m.github && (
                        <a
                          className="icon-chip"
                          href={m.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

      </div>

      {modalOpen && selected && (
        <div
          className="member-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={closeModal}
        >
          <div
            className="member-modal centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal-header">
              <img
                src={resolveAvatar(selected.avatar)}
                alt=""
                className="modal-avatar"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <div>
                <h3 id="modal-title" className="modal-name neon-inline">
                  {selected.name}
                </h3>
                <div className="modal-role glass-inline">{selected.role}</div>
              </div>
              <button
                aria-label="Close"
                className="modal-close"
                onClick={closeModal}
              >
                ✕
              </button>
            </header>

            <div className="modal-actions">
              {selected.linkedin && (
                <a
                  className="btn small"
                  href={selected.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              )}
              {selected.github && (
                <a
                  className="btn small"
                  href={selected.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
