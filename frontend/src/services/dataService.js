// frontend/src/services/dataService.js
import { INITIAL_EVENTS, INITIAL_POSTERS, INITIAL_ACHIEVEMENTS } from '../data/initialData';

const STORAGE_KEYS = {
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
  } catch (err) {
    console.error('Failed to save achievements:', err);
  }
}

export function addAchievement(imgUrl) {
  if (!imgUrl || typeof imgUrl !== 'string') return;
  const current = getAchievements();
  const updated = [imgUrl.trim(), ...current];
  saveAchievements(updated);
}

export function addAchievements(imgUrls) {
  if (!Array.isArray(imgUrls) || imgUrls.length === 0) return;
  const current = getAchievements();
  const valid = imgUrls.map(u => (typeof u === 'string' ? u.trim() : '')).filter(Boolean);
  const updated = [...valid, ...current];
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
