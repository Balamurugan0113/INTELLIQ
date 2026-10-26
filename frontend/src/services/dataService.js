// frontend/src/services/dataService.js
import { INITIAL_EVENTS, INITIAL_POSTERS, INITIAL_ACHIEVEMENTS } from '../data/initialData';

export const STORAGE_KEYS = {
  EVENTS: 'intelliq_admin_events_v1',
  POSTERS: 'intelliq_admin_posters_v1',
  ACHIEVEMENTS: 'intelliq_admin_achievements_v1'
};

const BROADCAST_EVENT = 'intelliq_data_change';

function emitChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(BROADCAST_EVENT));
  }
}

/**
 * Broadcasts sync message across all open tabs, windows, child popups, and cross-subdomain iframes.
 */
export function broadcastSync(key, data) {
  if (typeof window === 'undefined') return;

  const payload = {
    type: 'INTELLIQ_SYNC',
    key,
    data,
    timestamp: Date.now()
  };

  // 1. Post to all bridge iframes
  try {
    const iframes = document.querySelectorAll('iframe.intelliq-sync-bridge');
    iframes.forEach(iframe => {
      iframe.contentWindow?.postMessage(payload, '*');
    });
  } catch (err) {}

  // 2. Post to window.opener (when Live Site tab was opened from Admin Console)
  if (window.opener) {
    try {
      window.opener.postMessage(payload, '*');
    } catch (err) {}
  }

  // 3. Post to parent window (if running inside a bridge iframe)
  if (window.parent && window.parent !== window) {
    try {
      window.parent.postMessage(payload, '*');
    } catch (err) {}
  }
}

/**
 * Initializes cross-domain & cross-tab sync listeners.
 */
export function initCrossDomainSync() {
  if (typeof window === 'undefined') return () => {};

  const handleMessage = event => {
    if (!event.data || typeof event.data !== 'object') return;
    const { type, key, data, payload } = event.data;

    if (type === 'INTELLIQ_SYNC' && key && data) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        emitChange();
      } catch (e) {}
    } else if (type === 'INTELLIQ_SYNC_ALL' && payload) {
      try {
        if (payload.events) localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(payload.events));
        if (payload.posters) localStorage.setItem(STORAGE_KEYS.POSTERS, JSON.stringify(payload.posters));
        if (payload.achievements) localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(payload.achievements));
        emitChange();
      } catch (e) {}
    } else if (type === 'INTELLIQ_REQUEST_SYNC') {
      const response = {
        type: 'INTELLIQ_SYNC_ALL',
        payload: {
          events: getEvents(),
          posters: getPosters(),
          achievements: getAchievements()
        }
      };
      try {
        event.source?.postMessage(response, '*');
      } catch (e) {}
    }
  };

  window.addEventListener('message', handleMessage);

  // If this window was opened by Admin Console, request latest sync right away
  if (window.opener) {
    try {
      window.opener.postMessage({ type: 'INTELLIQ_REQUEST_SYNC' }, '*');
    } catch (e) {}
  }

  return () => window.removeEventListener('message', handleMessage);
}

/**
 * ============================================================================
 * EVENTS CRUD
 * ============================================================================
 */
export function getEvents() {
  if (typeof window === 'undefined') return INITIAL_EVENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_EVENTS;
  } catch (err) {
    console.error('Failed to read events from storage:', err);
    return INITIAL_EVENTS;
  }
}

export function saveEvents(events) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    emitChange();
    broadcastSync(STORAGE_KEYS.EVENTS, events);
  } catch (err) {
    console.error('Failed to save events:', err);
  }
}

export function addEvent(newEvent) {
  const current = getEvents();
  const eventWithId = {
    ...newEvent,
    id: newEvent.id || String(Date.now())
  };
  const updated = [eventWithId, ...current];
  saveEvents(updated);
  return eventWithId;
}

export function updateEvent(id, updatedFields) {
  const current = getEvents();
  const updated = current.map(item =>
    String(item.id) === String(id) ? { ...item, ...updatedFields } : item
  );
  saveEvents(updated);
}

export function deleteEvent(id) {
  const current = getEvents();
  const updated = current.filter(item => String(item.id) !== String(id));
  saveEvents(updated);
}

/**
 * ============================================================================
 * POSTERS CRUD
 * ============================================================================
 */
export function getPosters() {
  if (typeof window === 'undefined') return INITIAL_POSTERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.POSTERS, JSON.stringify(INITIAL_POSTERS));
      return INITIAL_POSTERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_POSTERS;
  } catch (err) {
    console.error('Failed to read posters from storage:', err);
    return INITIAL_POSTERS;
  }
}

export function savePosters(posters) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.POSTERS, JSON.stringify(posters));
    emitChange();
    broadcastSync(STORAGE_KEYS.POSTERS, posters);
  } catch (err) {
    console.error('Failed to save posters:', err);
  }
}

export function addPoster(newPoster) {
  const current = getPosters();
  const posterWithId = {
    ...newPoster,
    id: newPoster.id || `poster-${Date.now()}`,
    gradient: newPoster.gradient && newPoster.gradient.length >= 2 ? newPoster.gradient : ['#01cefc', '#ff3de8']
  };
  const updated = [...current, posterWithId];
  savePosters(updated);
  return posterWithId;
}

export function updatePoster(id, updatedFields) {
  const current = getPosters();
  const updated = current.map(item =>
    String(item.id) === String(id) ? { ...item, ...updatedFields } : item
  );
  savePosters(updated);
}

export function deletePoster(id) {
  const current = getPosters();
  const updated = current.filter(item => String(item.id) !== String(id));
  savePosters(updated);
}

/**
 * ============================================================================
 * STUDENT ACHIEVEMENTS CRUD
 * ============================================================================
 */
export function getAchievements() {
  if (typeof window === 'undefined') return INITIAL_ACHIEVEMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(INITIAL_ACHIEVEMENTS));
      return INITIAL_ACHIEVEMENTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_ACHIEVEMENTS;
    }
    // Auto-heal old lowercase /Achievements/achievements_ paths to uppercase /Achievements/Achievements_
    const sanitized = parsed.map(item => {
      if (typeof item === 'string' && item.startsWith('/Achievements/achievements_')) {
        return item.replace('/Achievements/achievements_', '/Achievements/Achievements_');
      }
      return item;
    });
    return sanitized;
  } catch (err) {
    console.error('Failed to read achievements from storage:', err);
    return INITIAL_ACHIEVEMENTS;
  }
}

export function saveAchievements(achievements) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    emitChange();
    broadcastSync(STORAGE_KEYS.ACHIEVEMENTS, achievements);
  } catch (err) {
    console.error('Failed to save achievements:', err);
  }
}

export function addAchievement(imgUrl) {
  if (!imgUrl || typeof imgUrl !== 'string') return;
  const current = getAchievements();
  // Append new photo to the end (last position) as requested
  const updated = [...current, imgUrl.trim()];
  saveAchievements(updated);
}

export function addAchievements(imgUrls) {
  if (!Array.isArray(imgUrls) || imgUrls.length === 0) return;
  const current = getAchievements();
  const valid = imgUrls.map(u => (typeof u === 'string' ? u.trim() : '')).filter(Boolean);
  // Append new photos to the end (last positions) as requested
  const updated = [...current, ...valid];
  saveAchievements(updated);
}

export function deleteAchievement(imgUrlOrIndex) {
  const current = getAchievements();
  let updated;
  if (typeof imgUrlOrIndex === 'number') {
    updated = current.filter((_, idx) => idx !== imgUrlOrIndex);
  } else {
    updated = current.filter(item => item !== imgUrlOrIndex);
  }
  saveAchievements(updated);
}

/**
 * ============================================================================
 * BACKUP, IMPORT, EXPORT, & RESET
 * ============================================================================
 */
export function exportAllData() {
  const payload = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    events: getEvents(),
    posters: getPosters(),
    achievements: getAchievements()
  };
  return JSON.stringify(payload, null, 2);
}

export function importAllData(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.events && Array.isArray(parsed.events)) {
      saveEvents(parsed.events);
    }
    if (parsed.posters && Array.isArray(parsed.posters)) {
      savePosters(parsed.posters);
    }
    if (parsed.achievements && Array.isArray(parsed.achievements)) {
      saveAchievements(parsed.achievements);
    }
    return { success: true };
  } catch (err) {
    console.error('Failed to import JSON data:', err);
    return { success: false, error: err.message };
  }
}

export function resetAllData() {
  saveEvents(INITIAL_EVENTS);
  savePosters(INITIAL_POSTERS);
  saveAchievements(INITIAL_ACHIEVEMENTS);
}

/**
 * ============================================================================
 * REACTIVE SUBSCRIPTION (Cross-tab + Local updates)
 * ============================================================================
 */
export function subscribeData(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleCustom = () => callback();
  const handleStorage = e => {
    if (Object.values(STORAGE_KEYS).includes(e.key)) {
      callback();
    }
  };

  window.addEventListener(BROADCAST_EVENT, handleCustom);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(BROADCAST_EVENT, handleCustom);
    window.removeEventListener('storage', handleStorage);
  };
}
