// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Section from './components/Section';
import Events from './components/Events';
import StudentAchievements from './components/StudentAchievements';
import Members from './components/Members';
import About from './components/About';
import VisionMission from './components/VisionMission';
import Posters from './components/Posters';
import LogoFadeLoop from './components/LogoFadeLoop';
import Contact from './components/Contact';
import PaymentModal from './components/PaymentModal';
import Footer from './components/Footer';
import Hero from './components/Hero';
import LoadingScreen from './components/LoadingScreen';
import CountdownPage from './components/CountdownPage';
import OverlayControls from './components/OverlayControls';
import AdminConsole from './components/admin/AdminConsole';
import { initCrossDomainSync } from './services/dataService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ============================================================================
// 🎯 WEBSITE LAUNCH REVEAL COUNTDOWN CONFIGURATION (EDIT TIMER HERE!)
// Format: "YYYY-MM-DDTHH:MM:SS" (e.g. "2026-09-01T15:00:00" = Sept 1, 2026 at 3:00 PM)
// ============================================================================
export const TARGET_REVEAL_DATE_STRING = "2026-09-01T15:39:00+05:30"; // Line 23
const TARGET_REVEAL_TIMESTAMP = new Date(TARGET_REVEAL_DATE_STRING).getTime();

// Helper to check if current visitor is requesting the hidden Admin Console
// Supported triggers:
// 1. Subdomains: admin.intelliq.co.in or console.intelliq.co.in
// 2. Paths: /admin or /console
// 3. Query params: ?admin=true or ?console=true
// 4. Hash: #admin or #console
function checkIsAdminView() {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  const search = window.location.search.toLowerCase();

  // If visitor specifically asked to view the live site, don't show admin console
  if (search.includes('view=live') || search.includes('preview=live') || search.includes('mode=live')) {
    return false;
  }

  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  return (
    host.startsWith('admin.') ||
    host.startsWith('console.') ||
    path === '/admin' ||
    path.startsWith('/admin/') ||
    path === '/console' ||
    path.startsWith('/console/') ||
    search.includes('admin=true') ||
    search.includes('console=true') ||
    hash === '#admin' ||
    hash === '#console'
  );
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(checkIsAdminView);
  const [supportOpen, setSupportOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // 0. Initialize cross-domain & cross-tab real-time sync
    const unsubscribeSync = initCrossDomainSync();

    const handleLocationChange = () => {
      setIsAdmin(checkIsAdminView());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    // Check if current time has passed the reveal target date
    const now = new Date().getTime();
    const hasPassedTarget = now >= TARGET_REVEAL_TIMESTAMP;

    // Check for admin preview override query parameter (e.g. https://www.intelliq.co.in/?preview=true)
    const isPreview = typeof window !== 'undefined' && window.location.search.includes('preview=true');

    if (hasPassedTarget || isPreview) {
      setIsRevealed(true);
    }

    return () => {
      unsubscribeSync();
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Minimal Bridge Iframe: when running as a hidden sync frame, no UI needed
  if (typeof window !== 'undefined' && window.location.search.includes('bridge=1')) {
    return <div style={{ display: 'none' }} aria-hidden="true" />;
  }

  // 0. IF ACCESSING ADMIN CONSOLE VIA SUBDOMAIN OR HIDDEN ROUTE:
  if (isAdmin) {
    return (
      <AdminConsole
        onExitToSite={() => {
          if (window.location.search.includes('admin=true') || window.location.search.includes('console=true')) {
            window.location.href = window.location.pathname;
          } else if (window.location.hash === '#admin' || window.location.hash === '#console') {
            window.location.hash = '';
            window.location.reload();
          } else {
            window.location.href = '/?preview=true';
          }
        }}
      />
    );
  }

  // 1. IF COUNTDOWN IS ACTIVE (BEFORE REVEAL DATE), SHOW ONLY COUNTDOWN PAGE!
  if (!isRevealed) {
    return (
      <CountdownPage
        targetDate={TARGET_REVEAL_TIMESTAMP}
        onReveal={() => setIsRevealed(true)}
      />
    );
  }

  // 2. AFTER COUNTDOWN REACHES 00:00:00:00, REVEAL FULL WEBSITE!
  return (
    <>
      {/* STARTUP LOGO LOADING PAGE */}
      {isLoading && <LoadingScreen onFinished={() => setIsLoading(false)} />}

      {/* REVEAL MAIN WEBSITE STRICTLY AFTER LOADING ANIMATION FINISHES */}
      {!isLoading && (
        <div style={{ position: "relative", zIndex: 1 }}>
          <Navbar />
          <main id="content">
            {/* 1. HERO SECTION (MAIN PAGE) */}
            <section data-trail="#01cefc">
              <Hero />
            </section>

            {/* 2. ABOUT INTELLIQ SECTION */}
            <section data-trail="#f0ff4a">
              <Section id="about" title="About INTELLIQ">
                <About />
              </Section>
            </section>

            {/* 3. VISION & MISSION SECTION */}
            <section data-trail="#01cefc">
              <Section id="vision" title="Vision & Mission">
                <VisionMission />
              </Section>
            </section>

            {/* 4. POSTERS SECTION (ABOVE EVENTS & BELOW VISION & MISSION) */}
            <section data-trail="#ff3de8">
              <Section id="posters" title="Posters">
                <Posters />
              </Section>
            </section>

            {/* 5. EVENTS SECTION */}
            <section data-trail="#ffc74d">
              <Section id="events" title="Events">
                <Events apiBase={API_URL} />
              </Section>
            </section>

            {/* 6. STUDENT ACHIEVEMENTS SECTION */}
            <section data-trail="#f0ff4a">
              <Section id="achievements" title="Student Achievements">
                <StudentAchievements />
              </Section>
            </section>

            {/* 7. MEMBERS & COORDINATORS SECTION */}
            <section data-trail="#f0ff4a">
              <Section id="members" variant="plain">
                <Members apiBase={API_URL} />
              </Section>
            </section>

            {/* 8. COLLABORATORS SECTION */}
            <section id="collaborators" variant="compact" data-trail="#37ff00">
              <LogoFadeLoop
                images={[
                  "/logos/logo1.png",
                  "/logos/logo2.png",
                  "/logos/logo3.png",
                  "/logos/logo4.png",
                  "/logos/logo5.png",
                  "/logos/logo6.png",
                  "/logos/logo7.png"
                ]}
                title="OUR COLLABORATORS"
                speed={10}
              />
            </section>

            {/* 9. CONTACT SECTION */}
            <section data-trail="#8800ff">
              <Section id="contact" title="Contact">
                <Contact apiBase={API_URL} />
              </Section>
            </section>
          </main>

          {/* Payment modal */}
          <PaymentModal
            open={supportOpen}
            onClose={() => setSupportOpen(false)}
            qrPath="/payments/gpay-qr.png"
            upiId="ammugowrir@oksbi"
            title="Support INTELLIQ — Scan to Pay"
            description="Scan this QR using Google Pay, PhonePe, or any UPI app."
          />

          {/* FOOTER */}
          <Footer />

          {/* Global Overlays (Chatbot & Background Music) */}
          <OverlayControls />

          {/* Cross-subdomain real-time storage bridge */}
          {typeof window !== 'undefined' && !window.location.search.includes('bridge=1') && (
            <iframe
              className="intelliq-sync-bridge"
              src={
                window.location.hostname.startsWith('admin.') || window.location.hostname.startsWith('console.')
                  ? `https://${window.location.hostname.replace(/^(admin|console)\./, '')}/?bridge=1`
                  : `https://admin.${window.location.hostname.replace(/^www\./, '')}/?bridge=1`
              }
              style={{ display: 'none', width: 0, height: 0, border: 'none' }}
              title="Cross-Domain Data Sync Bridge"
            />
          )}
        </div>
      )}
    </>
  );
}
