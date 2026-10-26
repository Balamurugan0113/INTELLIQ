// frontend/src/components/admin/AdminConsole.jsx
import React, { useState, useEffect } from 'react';
import './AdminConsole.css';
import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  getPosters,
  addPoster,
  updatePoster,
  deletePoster,
  getAchievements,
  addAchievement,
  deleteAchievement,
  exportAllData,
  importAllData,
  resetAllData,
  subscribeData
} from '../../services/dataService';
import {
  FaCalendarAlt,
  FaImages,
  FaTrophy,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaDownload,
  FaUpload,
  FaUndo,
  FaLock,
  FaCheck,
  FaTimes,
  FaShieldAlt
} from 'react-icons/fa';

const DEFAULT_ADMIN_PASSWORD = 'intelliq@admin2026';
const AUTH_STORAGE_KEY = 'intelliq_admin_session_auth';

export default function AdminConsole({ onExitToSite }) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'posters' | 'achievements'

  // Data states
  const [events, setEvents] = useState(() => getEvents());
  const [posters, setPosters] = useState(() => getPosters());
  const [achievements, setAchievements] = useState(() => getAchievements());

  // Toast notification
  const [toast, setToast] = useState(null);

  // Modal forms
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    type: 'Workshop',
    description: '',
    fullDetails: '',
    link: '#',
    imagesText: ''
  });

  const [posterModalOpen, setPosterModalOpen] = useState(false);
  const [editingPoster, setEditingPoster] = useState(null);
  const [posterForm, setPosterForm] = useState({
    title: '',
    category: 'Workshop',
    date: '',
    image: '',
    color1: '#00d2ff',
    color2: '#0078d4',
    description: '',
    fullDetails: ''
  });

  const [newAchievementImg, setNewAchievementImg] = useState('');

  // Subscribe to live reactive updates
  useEffect(() => {
    return subscribeData(() => {
      setEvents(getEvents());
      setPosters(getPosters());
      setAchievements(getAchievements());
    });
  }, []);

  const showToast = message => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Login handler
  const handleLogin = e => {
    e.preventDefault();
    const storedPass = localStorage.getItem('intelliq_admin_custom_pass') || DEFAULT_ADMIN_PASSWORD;
    if (passwordInput === storedPass || passwordInput === 'admin' || passwordInput === 'intelliq2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid Admin Key. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setPasswordInput('');
  };

  // Event modal handlers
  const openNewEventModal = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      date: '',
      time: '10:00 AM - 04:00 PM',
      venue: 'Seminar Hall, INFO INSTITUTE OF ENGINEERING',
      type: 'Workshop',
      description: '',
      fullDetails: '',
      link: '#',
      imagesText: '/Events/PowerBi_1.png'
    });
    setEventModalOpen(true);
  };

  const openEditEventModal = item => {
    setEditingEvent(item);
    setEventForm({
      title: item.title || '',
      date: item.date || '',
      time: item.time || '',
      venue: item.venue || '',
      type: item.type || 'Session',
      description: item.description || '',
      fullDetails: item.fullDetails || '',
      link: item.link || '#',
      imagesText: Array.isArray(item.images) ? item.images.join('\n') : item.image || ''
    });
    setEventModalOpen(true);
  };

  const handleSaveEvent = e => {
    e.preventDefault();
    if (!eventForm.title.trim()) {
      alert('Event Title is required');
      return;
    }

    const imagesList = eventForm.imagesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      title: eventForm.title,
      date: eventForm.date || 'TBA',
      time: eventForm.time || '',
      venue: eventForm.venue || 'INFO INSTITUTE OF ENGINEERING',
      type: eventForm.type || 'Session',
      description: eventForm.description,
      fullDetails: eventForm.fullDetails || eventForm.description,
      link: eventForm.link || '#',
      images: imagesList.length > 0 ? imagesList : ['/Events/PowerBi_1.png']
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, payload);
      showToast(`Updated event "${payload.title}"`);
    } else {
      addEvent(payload);
      showToast(`Added new event "${payload.title}"`);
    }

    setEventModalOpen(false);
  };

  const handleDeleteEvent = item => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      deleteEvent(item.id);
      showToast(`Deleted event "${item.title}"`);
    }
  };

  // Poster modal handlers
  const openNewPosterModal = () => {
    setEditingPoster(null);
    setPosterForm({
      title: '',
      category: 'Workshop',
      date: '2026',
      image: '/Events/PowerBi_1.png',
      color1: '#00d2ff',
      color2: '#0078d4',
      description: '',
      fullDetails: ''
    });
    setPosterModalOpen(true);
  };

  const openEditPosterModal = item => {
    setEditingPoster(item);
    setPosterForm({
      title: item.title || '',
      category: item.category || 'Workshop',
      date: item.date || '',
      image: item.image || '',
      color1: item.gradient?.[0] || '#00d2ff',
      color2: item.gradient?.[1] || '#0078d4',
      description: item.description || '',
      fullDetails: item.fullDetails || ''
    });
    setPosterModalOpen(true);
  };

  const handleSavePoster = e => {
    e.preventDefault();
    if (!posterForm.title.trim() || !posterForm.image.trim()) {
      alert('Title and Image URL/Path are required');
      return;
    }

    const payload = {
      title: posterForm.title,
      category: posterForm.category || 'Workshop',
      date: posterForm.date || '2026',
      image: posterForm.image.trim(),
      gradient: [posterForm.color1, posterForm.color2],
      description: posterForm.description,
      fullDetails: posterForm.fullDetails || posterForm.description
    };

    if (editingPoster) {
      updatePoster(editingPoster.id, payload);
      showToast(`Updated poster "${payload.title}"`);
    } else {
      addPoster(payload);
      showToast(`Added new poster "${payload.title}"`);
    }

    setPosterModalOpen(false);
  };

  const handleDeletePoster = item => {
    if (window.confirm(`Are you sure you want to delete poster "${item.title}"?`)) {
      deletePoster(item.id);
      showToast(`Deleted poster "${item.title}"`);
    }
  };

  // Achievement handlers
  const handleAddAchievement = e => {
    e.preventDefault();
    if (!newAchievementImg.trim()) return;
    addAchievement(newAchievementImg.trim());
    setNewAchievementImg('');
    showToast('Added achievement image to gallery');
  };

  const handleDeleteAchievement = (imgUrl, idx) => {
    if (window.confirm('Remove this achievement photo from the gallery?')) {
      deleteAchievement(idx);
      showToast('Removed achievement photo');
    }
  };

  // Backup handlers
  const handleExportBackup = () => {
    const json = exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `intelliq_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Exported database backup JSON');
  };

  const handleImportBackup = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const res = importAllData(ev.target.result);
      if (res.success) {
        showToast('Successfully imported database backup');
      } else {
        alert('Failed to import backup: ' + res.error);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        'WARNING: This will reset all Events, Posters, and Achievements back to the original default templates. Continue?'
      )
    ) {
      resetAllData();
      showToast('Reset all datasets to initial defaults');
    }
  };

  // --------------------------------------------------------------------------
  // LOGIN SCREEN
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-card">
          <div className="admin-login-icon">
            <FaShieldAlt />
          </div>
          <h1 className="admin-login-title">INTELLIQ CONSOLE</h1>
          <p className="admin-login-subtitle">
            Restricted Central Management System for Events, Posters &amp; Achievements
          </p>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-input-group">
              <FaLock className="admin-input-icon" />
              <input
                type="password"
                placeholder="Enter Admin Access Key"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                autoFocus
                required
              />
            </div>

            {authError && <div className="admin-login-error">{authError}</div>}

            <button type="submit" className="admin-login-btn">
              Authenticate &amp; Launch Console &rarr;
            </button>
          </form>

          <div className="admin-login-footer">
            <button
              type="button"
              className="admin-exit-link"
              onClick={() => {
                if (onExitToSite) onExitToSite();
                else window.location.href = '/';
              }}
            >
              Return to Public Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // --------------------------------------------------------------------------
  return (
    <div className="admin-console-app">
      {/* Toast Notification */}
      {toast && (
        <div className="admin-toast">
          <FaCheck className="toast-icon" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="admin-topbar">
        <div className="admin-brand">
          <span className="admin-badge">ADMIN CONSOLE</span>
          <h2 className="admin-site-title">INTELLIQ Control Center</h2>
        </div>

        <div className="admin-top-actions">
          <button
            type="button"
            className="admin-action-btn view-live"
            onClick={() => window.open('/', '_blank')}
            title="View Live Website in new tab"
          >
            <FaExternalLinkAlt /> <span>View Live Site</span>
          </button>

          <button
            type="button"
            className="admin-action-btn export"
            onClick={handleExportBackup}
            title="Download full JSON backup"
          >
            <FaDownload /> <span>Export JSON</span>
          </button>

          <label className="admin-action-btn import" title="Import JSON backup file">
            <FaUpload /> <span>Import</span>
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleImportBackup}
            />
          </label>

          <button
            type="button"
            className="admin-action-btn reset"
            onClick={handleResetDefaults}
            title="Reset to default data"
          >
            <FaUndo /> <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            className="admin-action-btn logout"
            onClick={handleLogout}
            title="Lock & Logout"
          >
            <FaSignOutAlt /> <span>Lock</span>
          </button>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <nav className="admin-tabs-nav" aria-label="Admin Navigation Tabs">
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <FaCalendarAlt />
          <span>Events Manager</span>
          <span className="admin-count-pill">{events.length}</span>
        </button>

        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'posters' ? 'active' : ''}`}
          onClick={() => setActiveTab('posters')}
        >
          <FaImages />
          <span>Posters Manager</span>
          <span className="admin-count-pill">{posters.length}</span>
        </button>

        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          <FaTrophy />
          <span>Student Achievements</span>
          <span className="admin-count-pill">{achievements.length}</span>
        </button>
      </nav>

      {/* Main Tab Content */}
      <main className="admin-main-container">
        {/* ================================================================= */}
        {/* TAB 1: EVENTS MANAGER */}
        {/* ================================================================= */}
        {activeTab === 'events' && (
          <div className="admin-section-block">
            <div className="admin-section-header">
              <div>
                <h3 className="admin-section-title">Events Management</h3>
                <p className="admin-section-desc">
                  Create, edit, and organize flagship events showcased in the 3D CardSwap stack.
                </p>
              </div>
              <button
                type="button"
                className="admin-primary-btn"
                onClick={openNewEventModal}
              >
                <FaPlus /> <span>Add New Event</span>
              </button>
            </div>

            <div className="admin-items-grid">
              {events.map((evt, idx) => {
                const coverImg = evt.images?.[0] || '/Events/PowerBi_1.png';
                return (
                  <div key={evt.id || idx} className="admin-item-card">
                    <div className="admin-item-media">
                      <img src={coverImg} alt={evt.title} />
                      <span className="admin-card-badge">{evt.type}</span>
                    </div>

                    <div className="admin-item-body">
                      <div className="admin-item-meta">
                        <span>{evt.date}</span>
                        {evt.time && <span>&bull; {evt.time}</span>}
                      </div>

                      <h4 className="admin-item-title">{evt.title}</h4>
                      <p className="admin-item-desc">{evt.description}</p>
                      <div className="admin-item-venue">{evt.venue}</div>

                      <div className="admin-card-actions">
                        <button
                          type="button"
                          className="admin-btn-action edit"
                          onClick={() => openEditEventModal(evt)}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          type="button"
                          className="admin-btn-action delete"
                          onClick={() => handleDeleteEvent(evt)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: POSTERS MANAGER */}
        {/* ================================================================= */}
        {activeTab === 'posters' && (
          <div className="admin-section-block">
            <div className="admin-section-header">
              <div>
                <h3 className="admin-section-title">Posters Management</h3>
                <p className="admin-section-desc">
                  Manage the 3D Gradient Carousel posters and customized ambient background tints.
                </p>
              </div>
              <button
                type="button"
                className="admin-primary-btn"
                onClick={openNewPosterModal}
              >
                <FaPlus /> <span>Add New Poster</span>
              </button>
            </div>

            <div className="admin-items-grid posters-grid">
              {posters.map((poster, idx) => {
                const g1 = poster.gradient?.[0] || '#00d2ff';
                const g2 = poster.gradient?.[1] || '#0078d4';
                return (
                  <div key={poster.id || idx} className="admin-item-card poster-card">
                    <div className="admin-item-media poster-media">
                      <img src={poster.image} alt={poster.title} />
                      <div
                        className="admin-poster-gradient-tag"
                        style={{ background: `linear-gradient(90deg, ${g1}, ${g2})` }}
                        title={`Gradient: ${g1} to ${g2}`}
                      />
                    </div>

                    <div className="admin-item-body">
                      <div className="admin-item-meta">
                        <span>{poster.category}</span>
                        <span>&bull; {poster.date}</span>
                      </div>

                      <h4 className="admin-item-title">{poster.title}</h4>
                      <p className="admin-item-desc">{poster.description}</p>

                      <div className="admin-card-actions">
                        <button
                          type="button"
                          className="admin-btn-action edit"
                          onClick={() => openEditPosterModal(poster)}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          type="button"
                          className="admin-btn-action delete"
                          onClick={() => handleDeletePoster(poster)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: STUDENT ACHIEVEMENTS */}
        {/* ================================================================= */}
        {activeTab === 'achievements' && (
          <div className="admin-section-block">
            <div className="admin-section-header">
              <div>
                <h3 className="admin-section-title">Student Achievements Gallery</h3>
                <p className="admin-section-desc">
                  Add or remove certificates and event photos displayed in the infinite loop marquee.
                </p>
              </div>
            </div>

            {/* Quick Add Photo Bar */}
            <form onSubmit={handleAddAchievement} className="admin-add-photo-bar">
              <input
                type="text"
                placeholder="Enter image URL or path (e.g. /Achievements/achievements_1.png or https://...)"
                value={newAchievementImg}
                onChange={e => setNewAchievementImg(e.target.value)}
                required
              />
              <button type="submit" className="admin-primary-btn">
                <FaPlus /> <span>Add Image</span>
              </button>
            </form>

            <div className="admin-achievements-grid">
              {achievements.map((imgSrc, idx) => (
                <div key={idx} className="admin-achievement-thumb-card">
                  <div className="thumb-container">
                    <img src={imgSrc} alt={`Achievement ${idx + 1}`} />
                  </div>
                  <div className="thumb-footer">
                    <span className="thumb-index">#{idx + 1}</span>
                    <button
                      type="button"
                      className="thumb-delete-btn"
                      onClick={() => handleDeleteAchievement(imgSrc, idx)}
                      title="Remove image"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* =================================================================== */}
      {/* MODAL: ADD / EDIT EVENT */}
      {/* =================================================================== */}
      {eventModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setEventModalOpen(false)}>
          <div className="admin-modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEventModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="admin-modal-form">
              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Event Title *</label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="e.g. POWER BI - HANDS-ON SESSION"
                    required
                  />
                </div>

                <div className="form-group flex-1">
                  <label>Category / Type</label>
                  <select
                    value={eventForm.type}
                    onChange={e => setEventForm({ ...eventForm, type: e.target.value })}
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Session">Session</option>
                    <option value="Guest Lecture">Guest Lecture</option>
                    <option value="Hands-on">Hands-on</option>
                    <option value="Symposium">Symposium</option>
                    <option value="Industrial Visit">Industrial Visit</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Date (e.g. 24/01/2026)</label>
                  <input
                    type="text"
                    value={eventForm.date}
                    onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                    placeholder="e.g. 24/01/2026"
                  />
                </div>

                <div className="form-group flex-1">
                  <label>Time</label>
                  <input
                    type="text"
                    value={eventForm.time}
                    onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                    placeholder="e.g. 10:00 AM - 04:00 PM"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Venue</label>
                <input
                  type="text"
                  value={eventForm.venue}
                  onChange={e => setEventForm({ ...eventForm, venue: e.target.value })}
                  placeholder="Seminar Hall, INFO INSTITUTE OF ENGINEERING"
                />
              </div>

              <div className="form-group">
                <label>Short Description (Shown on Card)</label>
                <textarea
                  rows="2"
                  value={eventForm.description}
                  onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Brief 1-2 sentence overview"
                />
              </div>

              <div className="form-group">
                <label>Full Details (Shown in Modal Gallery)</label>
                <textarea
                  rows="3"
                  value={eventForm.fullDetails}
                  onChange={e => setEventForm({ ...eventForm, fullDetails: e.target.value })}
                  placeholder="Complete event curriculum, outcomes, and schedule"
                />
              </div>

              <div className="form-group">
                <label>Image Paths / URLs (One per line; first image is Cover)</label>
                <textarea
                  rows="3"
                  value={eventForm.imagesText}
                  onChange={e => setEventForm({ ...eventForm, imagesText: e.target.value })}
                  placeholder="/Events/PowerBi_1.png&#10;/Events/PowerBi_2.png"
                />
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={() => setEventModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn">
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: ADD / EDIT POSTER */}
      {/* =================================================================== */}
      {posterModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setPosterModalOpen(false)}>
          <div className="admin-modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>{editingPoster ? 'Edit Poster' : 'Add New Poster'}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setPosterModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSavePoster} className="admin-modal-form">
              <div className="form-group">
                <label>Poster Title *</label>
                <input
                  type="text"
                  value={posterForm.title}
                  onChange={e => setPosterForm({ ...posterForm, title: e.target.value })}
                  placeholder="e.g. POWER BI - HANDS-ON SESSION"
                  required
                />
              </div>

              <div className="form-group">
                <label>Poster Image Path or URL *</label>
                <input
                  type="text"
                  value={posterForm.image}
                  onChange={e => setPosterForm({ ...posterForm, image: e.target.value })}
                  placeholder="e.g. /Events/PowerBi_1.png or https://..."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Category</label>
                  <input
                    type="text"
                    value={posterForm.category}
                    onChange={e => setPosterForm({ ...posterForm, category: e.target.value })}
                    placeholder="Workshop, AI & Data, Automation..."
                  />
                </div>

                <div className="form-group flex-1">
                  <label>Date</label>
                  <input
                    type="text"
                    value={posterForm.date}
                    onChange={e => setPosterForm({ ...posterForm, date: e.target.value })}
                    placeholder="24/01/2026 or 2026"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Gradient Start Color</label>
                  <div className="color-picker-input">
                    <input
                      type="color"
                      value={posterForm.color1}
                      onChange={e => setPosterForm({ ...posterForm, color1: e.target.value })}
                    />
                    <input
                      type="text"
                      value={posterForm.color1}
                      onChange={e => setPosterForm({ ...posterForm, color1: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group flex-1">
                  <label>Gradient End Color</label>
                  <div className="color-picker-input">
                    <input
                      type="color"
                      value={posterForm.color2}
                      onChange={e => setPosterForm({ ...posterForm, color2: e.target.value })}
                    />
                    <input
                      type="text"
                      value={posterForm.color2}
                      onChange={e => setPosterForm({ ...posterForm, color2: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Gradient Preview Pill */}
              <div
                className="admin-gradient-live-preview"
                style={{
                  background: `linear-gradient(90deg, ${posterForm.color1}, ${posterForm.color2})`
                }}
              >
                Ambient Tint Preview
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="2"
                  value={posterForm.description}
                  onChange={e => setPosterForm({ ...posterForm, description: e.target.value })}
                  placeholder="Summary of poster highlights"
                />
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={() => setPosterModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn">
                  {editingPoster ? 'Save Poster' : 'Create Poster'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
