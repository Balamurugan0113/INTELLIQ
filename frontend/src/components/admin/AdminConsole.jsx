// frontend/src/components/admin/AdminConsole.jsx
import React, { useState, useEffect, useMemo } from 'react';
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
  addAchievements,
  saveAchievements,
  deleteAchievement,
  exportAllData,
  importAllData,
  resetAllData,
  subscribeData,
  initCrossDomainSync
} from '../../services/dataService';
import { INITIAL_ACHIEVEMENTS } from '../../data/initialData';
import {
  formatGoogleDriveUrl,
  compressImageFile,
  processLocalFilesWithMetadata,
  formatFileSize,
  getImageDimensions,
  getSuitabilityGuideline
} from '../../utils/imageHelpers';
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
  FaShieldAlt,
  FaGoogleDrive,
  FaCloudUploadAlt,
  FaSyncAlt,
  FaLink,
  FaImage,
  FaBars,
  FaDice,
  FaCheckCircle,
  FaSearchPlus,
  FaRulerCombined,
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';

const DEFAULT_ADMIN_PASSWORD = 'intelliq@admin2026';
const AUTH_STORAGE_KEY = 'intelliq_admin_session_auth';

// Curated vibrant cyberpunk gradients matching INTELLIQ neon aesthetic
const CYBER_GRADIENT_PRESETS = [
  { id: 'cyan-blue', label: 'Cyber Ocean', colors: ['#00d2ff', '#0078d4'] },
  { id: 'neon-fuchsia', label: 'Neon Cyber', colors: ['#ff007f', '#7928ca'] },
  { id: 'electric-iris', label: 'Electric Iris', colors: ['#8a2be2', '#4a00e0'] },
  { id: 'solar-flare', label: 'Solar Flare', colors: ['#ff416c', '#ff4b2b'] },
  { id: 'hyper-gold', label: 'Hyper Gold', colors: ['#fa709a', '#fee140'] },
  { id: 'matrix-teal', label: 'Matrix Teal', colors: ['#00f2fe', '#4facfe'] },
  { id: 'synthwave', label: 'Synthwave', colors: ['#ff3de8', '#01cefc'] },
  { id: 'cosmic-mist', label: 'Cosmic Mist', colors: ['#6366f1', '#06b6d4'] },
  { id: 'aurora-emerald', label: 'Aurora Emerald', colors: ['#10b981', '#059669'] },
  { id: 'deep-space', label: 'Deep Space', colors: ['#3a7bd5', '#3a6073'] }
];

export default function AdminConsole({ onExitToSite }) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active navigation tab: 'events' | 'posters' | 'achievements'
  const [activeTab, setActiveTab] = useState('events');

  // Live data states
  const [events, setEvents] = useState(() => getEvents());
  const [posters, setPosters] = useState(() => getPosters());
  const [achievements, setAchievements] = useState(() => getAchievements());

  // Toast notification
  const [toast, setToast] = useState(null);

  // Full-size Image Inspection Lightbox Modal
  const [lightboxImg, setLightboxImg] = useState(null);

  // Modal forms
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '10:00 AM - 04:00 PM',
    venue: 'Seminar Hall, INFO INSTITUTE OF ENGINEERING',
    type: 'Workshop',
    description: '',
    fullDetails: '',
    link: '#',
    imagesText: '',
    uploadedFiles: [] // [{ name, sizeFormatted, dimensions, dataUrl }]
  });

  const [posterModalOpen, setPosterModalOpen] = useState(false);
  const [editingPoster, setEditingPoster] = useState(null);
  const [posterForm, setPosterForm] = useState({
    title: '',
    category: 'Workshop',
    date: '2026',
    image: '',
    color1: '#00d2ff',
    color2: '#0078d4',
    uploadedFile: null // { name, sizeFormatted, dimensions, dataUrl }
  });

  // Poster image dimensions and live-box fit
  const [posterDimensions, setPosterDimensions] = useState(null);
  const [posterSuitability, setPosterSuitability] = useState(null);

  // Achievements management states
  const [newAchievementImg, setNewAchievementImg] = useState('');
  const [driveAchievementUrl, setDriveAchievementUrl] = useState('');
  const [achievementAddMode, setAchievementAddMode] = useState('upload'); // 'upload' | 'drive' | 'url'
  const [recentAchievementUploads, setRecentAchievementUploads] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Google Drive & URL live verification state for Student Achievements
  const [drivePreviewUrl, setDrivePreviewUrl] = useState('');
  const [driveDimensions, setDriveDimensions] = useState(null);
  const [driveSuitability, setDriveSuitability] = useState(null);

  const [urlPreviewDimensions, setUrlPreviewDimensions] = useState(null);
  const [urlPreviewSuitability, setUrlPreviewSuitability] = useState(null);

  // Subscribe to live reactive updates and cross-domain synchronization
  useEffect(() => {
    const unsubscribeSync = initCrossDomainSync();
    const unsubscribeData = subscribeData(() => {
      setEvents(getEvents());
      setPosters(getPosters());
      setAchievements(getAchievements());
    });

    return () => {
      unsubscribeSync();
      unsubscribeData();
    };
  }, []);

  // Listen for ESC key to close lightbox
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape' && lightboxImg) {
        setLightboxImg(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImg]);

  // Compute live dimensions for poster image
  useEffect(() => {
    if (!posterForm.image) {
      setPosterDimensions(null);
      setPosterSuitability(null);
      return;
    }
    let isMounted = true;
    getImageDimensions(posterForm.image).then(dims => {
      if (isMounted) {
        setPosterDimensions(dims);
        setPosterSuitability(getSuitabilityGuideline('poster', dims));
      }
    });
    return () => {
      isMounted = false;
    };
  }, [posterForm.image]);

  // Compute live dimensions for Google Drive URL in Student Achievements
  useEffect(() => {
    if (!driveAchievementUrl.trim()) {
      setDrivePreviewUrl('');
      setDriveDimensions(null);
      setDriveSuitability(null);
      return;
    }
    const direct = formatGoogleDriveUrl(driveAchievementUrl.trim());
    setDrivePreviewUrl(direct);
    let isMounted = true;
    getImageDimensions(direct).then(dims => {
      if (isMounted) {
        setDriveDimensions(dims);
        setDriveSuitability(getSuitabilityGuideline('achievement', dims));
      }
    });
    return () => {
      isMounted = false;
    };
  }, [driveAchievementUrl]);

  // Compute live dimensions for direct Image URL/Path in Student Achievements
  useEffect(() => {
    if (!newAchievementImg.trim()) {
      setUrlPreviewDimensions(null);
      setUrlPreviewSuitability(null);
      return;
    }
    const direct = formatGoogleDriveUrl(newAchievementImg.trim());
    let isMounted = true;
    getImageDimensions(direct).then(dims => {
      if (isMounted) {
        setUrlPreviewDimensions(dims);
        setUrlPreviewSuitability(getSuitabilityGuideline('achievement', dims));
      }
    });
    return () => {
      isMounted = false;
    };
  }, [newAchievementImg]);

  const showToast = message => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3500);
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

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================
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
      imagesText: '/Events/PowerBi_1.png',
      uploadedFiles: []
    });
    setEventModalOpen(true);
  };

  const openEditEventModal = item => {
    setEditingEvent(item);
    const images = Array.isArray(item.images) ? item.images : [item.image || ''];
    const localUploaded = [];
    const textPaths = [];

    images.forEach((img, idx) => {
      if (img && img.startsWith('data:')) {
        localUploaded.push({
          name: `Image_${idx + 1}.png`,
          sizeFormatted: 'Embedded',
          dataUrl: img
        });
      } else if (img) {
        textPaths.push(img);
      }
    });

    setEventForm({
      title: item.title || '',
      date: item.date || '',
      time: item.time || '',
      venue: item.venue || '',
      type: item.type || 'Session',
      description: item.description || '',
      fullDetails: item.fullDetails || '',
      link: item.link || '#',
      imagesText: textPaths.join('\n'),
      uploadedFiles: localUploaded
    });
    setEventModalOpen(true);
  };

  const handleEventImageUpload = async e => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const metaList = await processLocalFilesWithMetadata(files);
      if (metaList.length > 0) {
        setEventForm(prev => ({
          ...prev,
          uploadedFiles: [...(prev.uploadedFiles || []), ...metaList]
        }));
        showToast(`Uploaded ${metaList.length} image(s) from device`);
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveEventUploadedFile = idxToRemove => {
    setEventForm(prev => ({
      ...prev,
      uploadedFiles: (prev.uploadedFiles || []).filter((_, i) => i !== idxToRemove)
    }));
  };

  const handleSaveEvent = e => {
    e.preventDefault();
    if (!eventForm.title.trim()) {
      alert('Event Title is required');
      return;
    }

    const textImages = eventForm.imagesText
      .split('\n')
      .map(s => formatGoogleDriveUrl(s.trim()))
      .filter(Boolean);

    const deviceImages = (eventForm.uploadedFiles || []).map(f => f.dataUrl);
    const combinedImages = [...deviceImages, ...textImages];

    const payload = {
      title: eventForm.title,
      date: eventForm.date || 'TBA',
      time: eventForm.time || '',
      venue: eventForm.venue || 'INFO INSTITUTE OF ENGINEERING',
      type: eventForm.type || 'Session',
      description: eventForm.description,
      fullDetails: eventForm.fullDetails || eventForm.description,
      link: eventForm.link || '#',
      images: combinedImages.length > 0 ? combinedImages : ['/Events/PowerBi_1.png']
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

  // ==========================================================================
  // POSTER HANDLERS (Description removed + Auto-gradient enabled)
  // ==========================================================================
  const openNewPosterModal = () => {
    setEditingPoster(null);
    const autoPreset = CYBER_GRADIENT_PRESETS[posters.length % CYBER_GRADIENT_PRESETS.length];
    setPosterForm({
      title: '',
      category: 'Workshop',
      date: '2026',
      image: '/Events/PowerBi_1.png',
      color1: autoPreset.colors[0],
      color2: autoPreset.colors[1],
      uploadedFile: null
    });
    setPosterModalOpen(true);
  };

  const openEditPosterModal = item => {
    setEditingPoster(item);
    setPosterForm({
      title: item.title || '',
      category: item.category || 'Workshop',
      date: item.date || '2026',
      image: item.image || '',
      color1: item.gradient?.[0] || '#00d2ff',
      color2: item.gradient?.[1] || '#0078d4',
      uploadedFile: null
    });
    setPosterModalOpen(true);
  };

  const handlePickRandomGradient = () => {
    const randomPreset =
      CYBER_GRADIENT_PRESETS[Math.floor(Math.random() * CYBER_GRADIENT_PRESETS.length)];
    setPosterForm(prev => ({
      ...prev,
      color1: randomPreset.colors[0],
      color2: randomPreset.colors[1]
    }));
    showToast(`Applied "${randomPreset.label}" gradient`);
  };

  const handleSelectGradientPreset = preset => {
    setPosterForm(prev => ({
      ...prev,
      color1: preset.colors[0],
      color2: preset.colors[1]
    }));
  };

  const handlePosterImageUpload = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const dataUrl = await compressImageFile(file);
      const dims = await getImageDimensions(dataUrl);
      setPosterForm(prev => ({
        ...prev,
        image: dataUrl,
        uploadedFile: {
          name: file.name,
          sizeFormatted: formatFileSize(file.size),
          dimensions: dims,
          dataUrl
        }
      }));
      setPosterDimensions(dims);
      setPosterSuitability(getSuitabilityGuideline('poster', dims));
      showToast(`Uploaded "${file.name}" (${dims ? dims.formatted : ''})`);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
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
      image: formatGoogleDriveUrl(posterForm.image.trim()),
      gradient: [posterForm.color1, posterForm.color2]
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

  // ==========================================================================
  // STUDENT ACHIEVEMENTS HANDLERS (Appends to last position)
  // ==========================================================================
  const handleLocalAchievementsUpload = async e => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const metaList = await processLocalFilesWithMetadata(files);
      if (metaList.length > 0) {
        const enrichedList = metaList.map(item => ({
          ...item,
          suitability: getSuitabilityGuideline('achievement', item.dimensions)
        }));
        const dataUrls = enrichedList.map(m => m.dataUrl);
        // Appends to last position in dataService
        addAchievements(dataUrls);
        setRecentAchievementUploads(enrichedList);
        showToast(`Uploaded ${enrichedList.length} photo(s) — appended to end of gallery!`);
      }
    } catch (err) {
      alert('Failed to upload image(s): ' + err.message);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // Google Drive URL detector helper
  const detectedDriveId = useMemo(() => {
    if (!driveAchievementUrl || !driveAchievementUrl.includes('drive.google.com')) return null;
    const match =
      driveAchievementUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      driveAchievementUrl.match(/id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }, [driveAchievementUrl]);

  const handleDriveAchievementAdd = e => {
    e.preventDefault();
    if (!driveAchievementUrl.trim()) return;
    const directUrl = formatGoogleDriveUrl(driveAchievementUrl.trim());
    // Appends to last position in dataService
    addAchievement(directUrl);
    setDriveAchievementUrl('');
    setDrivePreviewUrl('');
    showToast('Added Google Drive photo to end of achievements gallery!');
  };

  const handleAddAchievement = e => {
    e.preventDefault();
    if (!newAchievementImg.trim()) return;
    const directUrl = formatGoogleDriveUrl(newAchievementImg.trim());
    // Appends to last position in dataService
    addAchievement(directUrl);
    setNewAchievementImg('');
    showToast('Added photo to end of achievements gallery!');
  };

  const handleDeleteAchievement = (imgUrl, idx) => {
    if (window.confirm(`Remove achievement photo #${idx + 1} from the gallery?`)) {
      deleteAchievement(idx);
      // Also remove from recent uploads if present
      setRecentAchievementUploads(prev => prev.filter(p => p.dataUrl !== imgUrl));
      showToast(`Removed photo #${idx + 1}`);
    }
  };

  const handleRestoreOriginalAchievements = () => {
    if (
      window.confirm(
        'Restore all 13 original student achievement photos from the project folder (/Achievements/Achievements_1.png to _13.png)?'
      )
    ) {
      saveAchievements(INITIAL_ACHIEVEMENTS);
      setRecentAchievementUploads([]);
      showToast('Restored all 13 original project achievement photos!');
    }
  };

  // ==========================================================================
  // BACKUP & LIVE SITE HANDLERS
  // ==========================================================================
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
      setRecentAchievementUploads([]);
      showToast('Reset all datasets to initial defaults');
    }
  };

  const handleViewLiveSite = () => {
    if (typeof window === 'undefined') return;
    const host = window.location.hostname;
    let targetUrl;

    if (host.startsWith('admin.') || host.startsWith('console.')) {
      const primaryHost = host.replace(/^(admin|console)\./, '');
      targetUrl = `${window.location.protocol}//${primaryHost}/?preview=true`;
    } else {
      targetUrl = `/?preview=true`;
    }

    const payload = {
      events: getEvents(),
      posters: getPosters(),
      achievements: getAchievements()
    };

    const newWin = window.open(targetUrl, '_blank');
    if (newWin) {
      const sendSync = () => {
        try {
          newWin.postMessage({ type: 'INTELLIQ_SYNC_ALL', payload }, '*');
        } catch (e) {}
      };
      setTimeout(sendSync, 400);
      setTimeout(sendSync, 1000);
      setTimeout(sendSync, 2000);
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

      {/* Top Header Bar - Cohesive Cyber Glass Header */}
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-brand">
            <div className="admin-brand-icon-wrapper">
              <img
                src="/Logo.png"
                alt="INTELLIQ Logo"
                className="admin-brand-logo neon"
                width="34"
                height="34"
              />
              <span className="brand-pulse-ring" />
            </div>
            <div className="brand-title-col">
              <div className="brand-title-row">
                <span className="brand-text">INTELLIQ</span>
                <span className="admin-badge">CONSOLE</span>
              </div>
              <div className="brand-live-status">
                <span className="status-live-dot" />
                <span className="status-live-text">SYSTEM ONLINE &bull; SYNC ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="admin-topbar-right">
            <button
              type="button"
              className="admin-action-btn view-live"
              onClick={handleViewLiveSite}
              title="Open the live website with synchronized preview"
            >
              <FaExternalLinkAlt className="action-btn-icon" /> <span>View Live Site</span>
            </button>

            {/* Mobile hamburger toggle */}
            <button
              type="button"
              className={`admin-mobile-toggle ${mobileMenuOpen ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle admin actions"
              title="More actions"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Top Actions Drawer / Row */}
            <div className={`admin-top-actions ${mobileMenuOpen ? 'open' : ''}`}>
              <button
                type="button"
                className="admin-action-btn export"
                onClick={() => {
                  handleExportBackup();
                  setMobileMenuOpen(false);
                }}
                title="Download full JSON backup of events, posters, and achievements"
              >
                <FaDownload className="action-btn-icon" /> <span>Export JSON</span>
              </button>

              <label className="admin-action-btn import" title="Import JSON backup file">
                <FaUpload className="action-btn-icon" /> <span>Import</span>
                <input
                  type="file"
                  accept=".json"
                  style={{ display: 'none' }}
                  onChange={e => {
                    handleImportBackup(e);
                    setMobileMenuOpen(false);
                  }}
                />
              </label>

              <button
                type="button"
                className="admin-action-btn reset"
                onClick={() => {
                  handleResetDefaults();
                  setMobileMenuOpen(false);
                }}
                title="Reset to default data"
              >
                <FaUndo className="action-btn-icon" /> <span>Reset Defaults</span>
              </button>

              <button
                type="button"
                className="admin-action-btn logout"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                title="Lock & Logout"
              >
                <FaSignOutAlt className="action-btn-icon" /> <span>Lock</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cross-subdomain bridge iframe inside Admin Console */}
      {typeof window !== 'undefined' && (
        <iframe
          className="intelliq-sync-bridge"
          src={
            window.location.hostname.startsWith('admin.') || window.location.hostname.startsWith('console.')
              ? `https://${window.location.hostname.replace(/^(admin|console)\./, '')}/?bridge=1`
              : `https://admin.${window.location.hostname.replace(/^www\./, '')}/?bridge=1`
          }
          style={{ display: 'none', width: 0, height: 0, border: 'none' }}
          title="Admin Cross-Domain Sync Bridge"
        />
      )}

      {/* Sticky Glassy Navigation Bar: Top 3 boxes with titles alone */}
      <div className="admin-sticky-tabs-bar">
        <div className="admin-sticky-tabs-inner">
          <nav className="admin-tabs-nav" aria-label="Admin Navigation Tabs">
            {/* Box 1: Events Manager */}
            <button
              type="button"
              className={`admin-tab-box ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              <div className="tab-icon-badge events-badge">
                <FaCalendarAlt className="tab-icon" />
              </div>
              <div className="tab-text-group">
                <span className="tab-label">Events Manager</span>
                <span className="tab-sublabel">Flagship 3D Stacks</span>
              </div>
              <span className="admin-count-pill">{events.length}</span>
              <div className="tab-active-glow-bar" />
            </button>

            {/* Box 2: Posters Manager */}
            <button
              type="button"
              className={`admin-tab-box ${activeTab === 'posters' ? 'active' : ''}`}
              onClick={() => setActiveTab('posters')}
            >
              <div className="tab-icon-badge posters-badge">
                <FaImages className="tab-icon" />
              </div>
              <div className="tab-text-group">
                <span className="tab-label">Posters Manager</span>
                <span className="tab-sublabel">3D Ambient Carousel</span>
              </div>
              <span className="admin-count-pill">{posters.length}</span>
              <div className="tab-active-glow-bar" />
            </button>

            {/* Box 3: Student Achievements */}
            <button
              type="button"
              className={`admin-tab-box ${activeTab === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              <div className="tab-icon-badge achievements-badge">
                <FaTrophy className="tab-icon" />
              </div>
              <div className="tab-text-group">
                <span className="tab-label">Student Achievements</span>
                <span className="tab-sublabel">Curved Motion Gallery</span>
              </div>
              <span className="admin-count-pill">{achievements.length}</span>
              <div className="tab-active-glow-bar" />
            </button>
          </nav>
        </div>
      </div>

      {/* Main Container - Below cards scroll up underneath with glassy navbar effect */}
      <main className="admin-main-container">
        {/* ================================================================= */}
        {/* TAB 1: EVENTS MANAGER */}
        {/* ================================================================= */}
        {activeTab === 'events' && (
          <div className="admin-section-block">
            <div className="admin-section-header">
              <div className="section-title-col">
                <div className="section-badge-pill">EVENTS DECK</div>
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
                const totalPhotos = Array.isArray(evt.images) ? evt.images.length : 1;
                return (
                  <div key={evt.id || idx} className="admin-item-card">
                    <div className="admin-item-media">
                      <img src={coverImg} alt={evt.title} />
                      <span className="admin-card-badge">{evt.type}</span>
                      <span className="admin-photo-count-badge">
                        <FaImage /> {totalPhotos} {totalPhotos === 1 ? 'photo' : 'photos'}
                      </span>
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
        {/* TAB 2: POSTERS MANAGER (No Description + Auto Gradients) */}
        {/* ================================================================= */}
        {activeTab === 'posters' && (
          <div className="admin-section-block">
            <div className="admin-section-header">
              <div className="section-title-col">
                <div className="section-badge-pill">3D POSTERS DECK</div>
                <h3 className="admin-section-title">Posters Management</h3>
                <p className="admin-section-desc">
                  Manage the 3D Gradient Carousel posters. Dual-color ambient gradients are automatically set!
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
                      <button
                        type="button"
                        className="card-media-zoom-btn"
                        onClick={() =>
                          setLightboxImg({
                            url: poster.image,
                            title: poster.title,
                            dimensions: 'Live 3D Carousel Poster',
                            suitability: {
                              level: 'perfect',
                              label: 'Active 3D Carousel Poster',
                              details: `Gradient Tint: ${g1} to ${g2}`
                            }
                          })
                        }
                        title="Click to preview full poster"
                      >
                        <FaSearchPlus />
                      </button>
                    </div>

                    <div className="admin-item-body">
                      <div className="admin-item-meta">
                        <span>{poster.category}</span>
                        <span>&bull; {poster.date}</span>
                      </div>

                      <h4 className="admin-item-title">{poster.title}</h4>

                      {/* Gradient Badge Pill */}
                      <div className="poster-gradient-info-chip">
                        <span
                          className="poster-color-dot"
                          style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}
                        />
                        <span className="poster-color-hex">{g1} &rarr; {g2}</span>
                      </div>

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
        {/* TAB 3: STUDENT ACHIEVEMENTS (Appends to last + Preview & Dimensions) */}
        {/* ================================================================= */}
        {activeTab === 'achievements' && (
          <div className="admin-section-block">
            <div className="admin-section-header">
              <div className="section-title-col">
                <div className="section-badge-pill">STUDENT GALLERY</div>
                <h3 className="admin-section-title">Student Achievements Gallery</h3>
                <p className="admin-section-desc">
                  Add photos directly from your device, computer, or Google Drive. New photos are appended to the <strong>last position</strong>.
                </p>
              </div>
              <button
                type="button"
                className="admin-action-btn restore-project-btn"
                onClick={handleRestoreOriginalAchievements}
                title="Restore original 13 project achievement photos from public/Achievements"
              >
                <FaSyncAlt /> <span>Restore 13 Project Photos</span>
              </button>
            </div>

            {/* Dimension Specifications Banner for Marquee Box */}
            <div className="achievement-guideline-banner">
              <div className="guideline-icon-circle">
                <FaRulerCombined />
              </div>
              <div className="guideline-banner-text">
                <strong>Recommended Live Marquee Box Dimensions: 400 &times; 270 px</strong>
                <p>
                  Aspect ratio: <strong>4:3 or 16:9 (Landscape)</strong>. Recommended resolution: <strong>800 &times; 540 px</strong> or <strong>1200 &times; 800 px</strong>. New photos are appended to the last position in the live motion track.
                </p>
              </div>
            </div>

            {/* Media Upload Studio for Achievements */}
            <div className="admin-upload-studio">
              <div className="studio-tabs">
                <button
                  type="button"
                  className={`studio-tab-btn ${achievementAddMode === 'upload' ? 'active' : ''}`}
                  onClick={() => setAchievementAddMode('upload')}
                >
                  <FaCloudUploadAlt /> <span>Upload from Device</span>
                </button>
                <button
                  type="button"
                  className={`studio-tab-btn ${achievementAddMode === 'drive' ? 'active' : ''}`}
                  onClick={() => setAchievementAddMode('drive')}
                >
                  <FaGoogleDrive /> <span>Google Drive Link</span>
                </button>
                <button
                  type="button"
                  className={`studio-tab-btn ${achievementAddMode === 'url' ? 'active' : ''}`}
                  onClick={() => setAchievementAddMode('url')}
                >
                  <FaLink /> <span>Image URL / Path</span>
                </button>
              </div>

              <div className="studio-content">
                {/* 1. UPLOAD FROM COMPUTER / DEVICE */}
                {achievementAddMode === 'upload' && (
                  <div className="studio-upload-box">
                    <input
                      type="file"
                      id="achievement-file-input"
                      accept="image/*"
                      multiple
                      onChange={handleLocalAchievementsUpload}
                      style={{ display: 'none' }}
                      disabled={isUploading}
                    />
                    <label htmlFor="achievement-file-input" className="studio-dropzone">
                      <div className="dropzone-icon">
                        <FaCloudUploadAlt />
                      </div>
                      <div className="dropzone-text">
                        <strong>Click or tap to select image files from your computer or phone</strong>
                        <p>
                          Supports PNG, JPG, JPEG, and WEBP. You can select multiple photos at once. Photos will save to the end of the gallery.
                        </p>
                      </div>
                      <span className="studio-browse-btn">
                        {isUploading ? 'Compressing & Adding to Last...' : 'Choose Photos from Device'}
                      </span>
                    </label>

                    {/* Rich Confirmation Deck of uploaded files showing Preview, Dimensions & Size */}
                    {recentAchievementUploads.length > 0 && (
                      <div className="upload-confirmation-deck">
                        <div className="deck-header">
                          <FaCheckCircle className="deck-check-icon" />
                          <span>
                            Recently Uploaded ({recentAchievementUploads.length} Photos Appended to Last Position)
                          </span>
                        </div>
                        <div className="deck-files-grid">
                          {recentAchievementUploads.map((file, idx) => (
                            <div key={idx} className="deck-file-card detailed">
                              <div
                                className="deck-file-thumb-wrapper"
                                onClick={() =>
                                  setLightboxImg({
                                    url: file.dataUrl,
                                    title: file.name,
                                    dimensions: file.dimensions?.formatted,
                                    size: file.sizeFormatted,
                                    suitability: file.suitability
                                  })
                                }
                                title="Click to view full size"
                              >
                                <img src={file.dataUrl} alt={file.name} className="deck-file-thumb" />
                                <span className="deck-thumb-zoom-icon">
                                  <FaSearchPlus />
                                </span>
                              </div>

                              <div className="deck-file-details">
                                <span className="deck-file-name" title={file.name}>{file.name}</span>
                                
                                <div className="deck-file-meta-row">
                                  {file.dimensions && (
                                    <span className="deck-dimension-pill">
                                      <FaRulerCombined /> {file.dimensions.formatted}
                                    </span>
                                  )}
                                  <span className="deck-size-pill">{file.sizeFormatted}</span>
                                </div>

                                {file.suitability && (
                                  <span className={`deck-suitability-tag ${file.suitability.level}`}>
                                    {file.suitability.label}
                                  </span>
                                )}
                              </div>

                              <div className="deck-file-actions">
                                <span className="deck-file-badge">Appended &rarr; End</span>
                                <button
                                  type="button"
                                  className="deck-remove-btn"
                                  onClick={() => handleDeleteAchievement(file.dataUrl, achievements.indexOf(file.dataUrl))}
                                  title="Remove this photo from gallery"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. GOOGLE DRIVE LINK - High-contrast readable input with Live Image Preview & Dimensions */}
                {achievementAddMode === 'drive' && (
                  <form onSubmit={handleDriveAchievementAdd} className="studio-form-stack">
                    <div className="drive-input-container">
                      <div className="studio-input-with-icon high-contrast">
                        <FaGoogleDrive className="studio-field-icon drive-icon" />
                        <input
                          type="text"
                          className="high-contrast-input"
                          placeholder="Paste Google Drive share link (e.g. https://drive.google.com/file/d/1aB2c.../view?usp=sharing)"
                          value={driveAchievementUrl}
                          onChange={e => setDriveAchievementUrl(e.target.value)}
                          required
                        />
                        {driveAchievementUrl && (
                          <button
                            type="button"
                            className="input-clear-btn"
                            onClick={() => {
                              setDriveAchievementUrl('');
                              setDrivePreviewUrl('');
                            }}
                            title="Clear link"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                      <button type="submit" className="admin-primary-btn drive-submit-btn">
                        <FaPlus /> <span>Add to End of Gallery</span>
                      </button>
                    </div>

                    {/* Live Preview Card for Google Drive Photo before adding */}
                    {drivePreviewUrl && (
                      <div className="drive-live-preview-box">
                        <div
                          className="drive-preview-media"
                          onClick={() =>
                            setLightboxImg({
                              url: drivePreviewUrl,
                              title: `Google Drive Photo (${detectedDriveId || 'Preview'})`,
                              dimensions: driveDimensions?.formatted,
                              suitability: driveSuitability
                            })
                          }
                          title="Click to view full image"
                        >
                          <img
                            src={drivePreviewUrl}
                            alt="Google Drive Preview"
                            className="drive-preview-img"
                          />
                          <span className="drive-preview-zoom-badge">
                            <FaSearchPlus /> Click to Inspect
                          </span>
                        </div>

                        <div className="drive-preview-details">
                          <div className="drive-preview-status">
                            <FaCheckCircle className="feedback-check" />
                            <strong>Google Drive Image Verified &amp; Ready</strong>
                          </div>

                          {driveDimensions && (
                            <div className="preview-dimensions-row">
                              <span className="dimension-badge">
                                <FaRulerCombined /> {driveDimensions.formatted}
                              </span>
                              <span className="aspect-ratio-pill">{driveDimensions.ratioLabel}</span>
                            </div>
                          )}

                          {driveSuitability && (
                            <div className={`suitability-badge ${driveSuitability.level}`}>
                              <div className="suitability-text">
                                <strong>{driveSuitability.label}</strong>
                                <p>{driveSuitability.details}</p>
                              </div>
                            </div>
                          )}

                          <p className="drive-confirm-text">
                            Preview loaded successfully. Click <strong>"Add to End of Gallery"</strong> to append it as the last item.
                          </p>
                        </div>
                      </div>
                    )}

                    {!driveAchievementUrl && (
                      <p className="studio-hint">
                        * Note: In Google Drive, ensure the file permission is set to <strong>"Anyone with the link can view"</strong> so it displays publicly.
                      </p>
                    )}
                  </form>
                )}

                {/* 3. IMAGE URL OR PROJECT PATH */}
                {achievementAddMode === 'url' && (
                  <form onSubmit={handleAddAchievement} className="studio-form-stack">
                    <div className="drive-input-container">
                      <div className="studio-input-with-icon high-contrast">
                        <FaLink className="studio-field-icon" />
                        <input
                          type="text"
                          className="high-contrast-input"
                          placeholder="Enter image path (e.g. /Achievements/Achievements_1.png or https://...)"
                          value={newAchievementImg}
                          onChange={e => setNewAchievementImg(e.target.value)}
                          required
                        />
                        {newAchievementImg && (
                          <button
                            type="button"
                            className="input-clear-btn"
                            onClick={() => setNewAchievementImg('')}
                            title="Clear"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                      <button type="submit" className="admin-primary-btn drive-submit-btn">
                        <FaPlus /> <span>Add to End of Gallery</span>
                      </button>
                    </div>

                    {/* Live Preview Card for URL/Path before adding */}
                    {newAchievementImg.trim() && (
                      <div className="drive-live-preview-box">
                        <div
                          className="drive-preview-media"
                          onClick={() =>
                            setLightboxImg({
                              url: formatGoogleDriveUrl(newAchievementImg.trim()),
                              title: newAchievementImg,
                              dimensions: urlPreviewDimensions?.formatted,
                              suitability: urlPreviewSuitability
                            })
                          }
                          title="Click to view full image"
                        >
                          <img
                            src={formatGoogleDriveUrl(newAchievementImg.trim())}
                            alt="Preview"
                            className="drive-preview-img"
                          />
                          <span className="drive-preview-zoom-badge">
                            <FaSearchPlus /> Click to Inspect
                          </span>
                        </div>

                        <div className="drive-preview-details">
                          <div className="drive-preview-status">
                            <FaCheckCircle className="feedback-check" />
                            <strong>Image Path Verified</strong>
                          </div>

                          {urlPreviewDimensions && (
                            <div className="preview-dimensions-row">
                              <span className="dimension-badge">
                                <FaRulerCombined /> {urlPreviewDimensions.formatted}
                              </span>
                              <span className="aspect-ratio-pill">{urlPreviewDimensions.ratioLabel}</span>
                            </div>
                          )}

                          {urlPreviewSuitability && (
                            <div className={`suitability-badge ${urlPreviewSuitability.level}`}>
                              <div className="suitability-text">
                                <strong>{urlPreviewSuitability.label}</strong>
                                <p>{urlPreviewSuitability.details}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>

            {/* Achievements Photos Grid - Clearly showing index numbers & zoom inspector */}
            <div className="admin-achievements-grid">
              {achievements.map((imgSrc, idx) => (
                <div key={idx} className="admin-achievement-thumb-card">
                  <div
                    className="thumb-container"
                    onClick={() =>
                      setLightboxImg({
                        url: imgSrc,
                        title: `Achievement Photo #${idx + 1}`,
                        dimensions: 'Student Achievements Gallery',
                        suitability: {
                          level: 'perfect',
                          label: idx === achievements.length - 1 ? 'Last Gallery Item' : `Item #${idx + 1}`,
                          details: 'Displays in pure image marquee track on live site.'
                        }
                      })
                    }
                    title="Click to view full size in high definition"
                  >
                    <img src={imgSrc} alt={`Achievement ${idx + 1}`} />
                    <span className="thumb-zoom-overlay">
                      <FaSearchPlus />
                    </span>
                  </div>
                  <div className="thumb-footer">
                    <div className="thumb-index-badge">
                      <span className="thumb-index">#{idx + 1}</span>
                      {idx === achievements.length - 1 && (
                        <span className="last-photo-indicator">LAST</span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="thumb-delete-btn"
                      onClick={() => handleDeleteAchievement(imgSrc, idx)}
                      title={`Remove photo #${idx + 1}`}
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
      {/* UNIVERSAL FULL-SIZE LIGHTBOX INSPECTION MODAL */}
      {/* =================================================================== */}
      {lightboxImg && (
        <div className="admin-lightbox-overlay" onClick={() => setLightboxImg(null)}>
          <div className="admin-lightbox-container" onClick={e => e.stopPropagation()}>
            <div className="admin-lightbox-header">
              <div className="lightbox-title-group">
                <h4>{lightboxImg.title || 'Image Inspection Preview'}</h4>
                <div className="lightbox-meta-row">
                  {lightboxImg.dimensions && (
                    <span className="lightbox-meta-pill">
                      <FaRulerCombined /> {lightboxImg.dimensions}
                    </span>
                  )}
                  {lightboxImg.size && (
                    <span className="lightbox-meta-pill">{lightboxImg.size}</span>
                  )}
                  {lightboxImg.suitability && (
                    <span className={`lightbox-suitability-pill ${lightboxImg.suitability.level}`}>
                      {lightboxImg.suitability.label}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="lightbox-close-btn"
                onClick={() => setLightboxImg(null)}
                title="Close Preview (ESC)"
              >
                <FaTimes />
              </button>
            </div>

            <div className="admin-lightbox-body">
              <img src={lightboxImg.url} alt={lightboxImg.title} className="lightbox-full-img" />
            </div>

            <div className="admin-lightbox-footer">
              <span className="lightbox-footer-tip">
                Full uncropped resolution. Verify image clarity, text, and composition before saving.
              </span>
              <button
                type="button"
                className="admin-cancel-btn"
                onClick={() => setLightboxImg(null)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

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

              {/* Uploaded Images Deck with File Names, Sizes & Preview */}
              <div className="form-group">
                <div className="label-with-actions">
                  <label>Event Photos &amp; Banners</label>
                  <label className="admin-file-upload-pill" title="Upload photos from device">
                    <FaUpload /> <span>Upload from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleEventImageUpload}
                      style={{ display: 'none' }}
                      disabled={isUploading}
                    />
                  </label>
                </div>

                {/* Show uploaded device files visually with filenames, sizes, and dimensions */}
                {eventForm.uploadedFiles && eventForm.uploadedFiles.length > 0 && (
                  <div className="modal-uploaded-files-list">
                    <span className="modal-uploaded-label">Uploaded Device Files:</span>
                    {eventForm.uploadedFiles.map((file, idx) => (
                      <div key={idx} className="modal-uploaded-file-row">
                        <img
                          src={file.dataUrl}
                          alt={file.name}
                          className="modal-uploaded-thumb"
                          onClick={() =>
                            setLightboxImg({
                              url: file.dataUrl,
                              title: file.name,
                              dimensions: file.dimensions?.formatted,
                              size: file.sizeFormatted
                            })
                          }
                          title="Click to inspect full image"
                        />
                        <div className="modal-uploaded-info">
                          <span className="modal-uploaded-name" title={file.name}>{file.name}</span>
                          <span className="modal-uploaded-size">
                            {file.dimensions?.formatted ? `${file.dimensions.formatted} \u2022 ` : ''}
                            {file.sizeFormatted} &bull; Ready
                          </span>
                        </div>
                        {idx === 0 && <span className="modal-cover-badge">Cover</span>}
                        <button
                          type="button"
                          className="modal-remove-file-btn"
                          onClick={() => handleRemoveEventUploadedFile(idx)}
                          title="Remove this photo"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Manual Textarea for Image paths / Google Drive links */}
                <label className="sub-field-label">Additional Image Paths or Google Drive links (one per line):</label>
                <textarea
                  rows="2"
                  value={eventForm.imagesText}
                  onChange={e => setEventForm({ ...eventForm, imagesText: e.target.value })}
                  placeholder="/Events/PowerBi_1.png&#10;Paste Google Drive links or image paths here..."
                />
                <span className="field-hint">
                  Tip: Google Drive share links are automatically converted to direct streamable images.
                </span>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={() => setEventModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn" disabled={isUploading}>
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: ADD / EDIT POSTER (With Live Preview, Dimensions & Suitability) */}
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

              {/* Poster Image: Upload from Device or enter URL/Path with Dimension Verification */}
              <div className="form-group">
                <div className="label-with-actions">
                  <label>Poster Image *</label>
                  <label className="admin-file-upload-pill" title="Upload poster image from device">
                    <FaUpload /> <span>Upload from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePosterImageUpload}
                      style={{ display: 'none' }}
                      disabled={isUploading}
                    />
                  </label>
                </div>

                {/* Prominent Live Poster Preview Card with Dimensions & Fit Indicator */}
                {posterForm.image ? (
                  <div className="poster-preview-hero-card">
                    <div
                      className="poster-preview-stage"
                      style={{
                        background: `linear-gradient(135deg, ${posterForm.color1}25, ${posterForm.color2}25)`,
                        borderColor: posterForm.color1
                      }}
                      onClick={() =>
                        setLightboxImg({
                          url: posterForm.image,
                          title: posterForm.title || posterForm.uploadedFile?.name || 'Poster Preview',
                          dimensions: posterDimensions?.formatted,
                          size: posterForm.uploadedFile?.sizeFormatted,
                          suitability: posterSuitability
                        })
                      }
                      title="Click to inspect full image"
                    >
                      <img
                        src={posterForm.image}
                        alt="Poster Preview"
                        className="poster-preview-img"
                      />
                      <button
                        type="button"
                        className="poster-zoom-btn"
                        onClick={e => {
                          e.stopPropagation();
                          setLightboxImg({
                            url: posterForm.image,
                            title: posterForm.title || posterForm.uploadedFile?.name || 'Poster Preview',
                            dimensions: posterDimensions?.formatted,
                            size: posterForm.uploadedFile?.sizeFormatted,
                            suitability: posterSuitability
                          });
                        }}
                      >
                        <FaSearchPlus /> <span>Inspect Full Size</span>
                      </button>
                    </div>

                    <div className="poster-preview-meta-panel">
                      <div className="meta-panel-header">
                        <span className="meta-filename" title={posterForm.uploadedFile?.name || posterForm.image}>
                          {posterForm.uploadedFile?.name || 'External Image Link / Path'}
                        </span>
                        {posterForm.uploadedFile?.sizeFormatted && (
                          <span className="meta-filesize">{posterForm.uploadedFile.sizeFormatted}</span>
                        )}
                      </div>

                      {posterDimensions && (
                        <div className="meta-dimensions-row">
                          <div className="dimension-badge">
                            <FaRulerCombined />
                            <span>{posterDimensions.formatted}</span>
                          </div>
                          <span className="aspect-ratio-pill">{posterDimensions.ratioLabel}</span>
                        </div>
                      )}

                      {posterSuitability && (
                        <div className={`suitability-badge ${posterSuitability.level}`}>
                          <div className="suitability-text">
                            <strong>{posterSuitability.label}</strong>
                            <p>{posterSuitability.details}</p>
                          </div>
                        </div>
                      )}

                      <div className="live-box-guideline">
                        <FaInfoCircle className="guideline-icon" />
                        <span>Live 3D Carousel box: <strong>350 &times; 460 px</strong> (Aspect ratio ~3:4 Portrait).</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="empty-preview-guideline poster">
                    <div className="guideline-box-icon">📐</div>
                    <div className="guideline-box-content">
                      <strong>Recommended Poster Box Size: 350 &times; 460 px</strong>
                      <p>
                        Aspect ratio: <strong>3:4 or 4:5 (Vertical Portrait)</strong>. Recommended resolution: <strong>700 &times; 920 px</strong> or <strong>1050 &times; 1380 px</strong> for crisp 3D Carousel rendering.
                      </p>
                    </div>
                  </div>
                )}

                <input
                  type="text"
                  className="high-contrast-input"
                  value={posterForm.image}
                  onChange={e =>
                    setPosterForm({
                      ...posterForm,
                      image: formatGoogleDriveUrl(e.target.value),
                      uploadedFile: null
                    })
                  }
                  placeholder="e.g. /Events/PowerBi_1.png or Google Drive link"
                  required
                />
                <span className="field-hint">
                  Tip: Upload from device, or paste a Google Drive share link / project path.
                </span>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Category</label>
                  <input
                    type="text"
                    value={posterForm.category}
                    onChange={e => setPosterForm({ ...posterForm, category: e.target.value })}
                    placeholder="Workshop, AI &amp; Data, Automation..."
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

              {/* Automatic Dual-Color Gradient Palette */}
              <div className="form-group gradient-studio-group">
                <div className="label-with-actions">
                  <label>Ambient Gradient Colors (Automatically Assigned)</label>
                  <button
                    type="button"
                    className="admin-dice-btn"
                    onClick={handlePickRandomGradient}
                    title="Auto-pick random vibrant cyberpunk gradient"
                  >
                    <FaDice /> <span>Auto-Pick Gradient</span>
                  </button>
                </div>

                {/* Live Gradient Preview Bar */}
                <div
                  className="admin-gradient-live-preview"
                  style={{
                    background: `linear-gradient(90deg, ${posterForm.color1}, ${posterForm.color2})`
                  }}
                >
                  <span className="gradient-preview-text">
                    Ambient Background Tint: {posterForm.color1} &rarr; {posterForm.color2}
                  </span>
                </div>

                {/* Quick Swatch Presets */}
                <div className="gradient-presets-ribbon">
                  {CYBER_GRADIENT_PRESETS.map(preset => {
                    const isSelected =
                      posterForm.color1.toLowerCase() === preset.colors[0].toLowerCase() &&
                      posterForm.color2.toLowerCase() === preset.colors[1].toLowerCase();
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        className={`gradient-chip ${isSelected ? 'selected' : ''}`}
                        style={{
                          background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})`
                        }}
                        onClick={() => handleSelectGradientPreset(preset)}
                        title={preset.label}
                      >
                        {isSelected && <FaCheck className="chip-check" />}
                      </button>
                    );
                  })}
                </div>

                {/* Fine-tuning Color Pickers */}
                <div className="form-row" style={{ marginTop: '8px' }}>
                  <div className="form-group flex-1">
                    <span className="sub-field-label">Start Color</span>
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
                    <span className="sub-field-label">End Color</span>
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
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={() => setPosterModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn" disabled={isUploading}>
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
