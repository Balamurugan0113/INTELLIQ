// frontend/src/App.jsx
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Section from './components/Section';
import Events from './components/Events';
import StudentAchievements from './components/StudentAchievements';
import Members from './components/Members';
import About from './components/About';
import VisionMission from './components/VisionMission';
import LogoFadeLoop from './components/LogoFadeLoop';
import Contact from './components/Contact';
import PaymentModal from './components/PaymentModal';
import Footer from './components/Footer';
import Hero from './components/Hero';
import LoadingScreen from './components/LoadingScreen';
import CanvasWaterFluidCursor from "@/components/ui/canvas-water-fluid-cursor";
import OverlayControls from './components/OverlayControls';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function App() {
  const [supportOpen, setSupportOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* STARTUP LOGO LOADING PAGE */}
      {isLoading && <LoadingScreen onFinished={() => setIsLoading(false)} />}

      {/* SPLASH CURSOR TRAIL  */}
      <CanvasWaterFluidCursor blur={16} coreSize={1.8} maxDrops={75} />

      {/* All content above the canvas */}
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

          {/* 4. EVENTS SECTION */}
          <section data-trail="#ffc74d">
            <Section id="events" title="Events">
              <Events apiBase={API_URL} />
            </Section>
          </section>

          {/* 5. STUDENT ACHIEVEMENTS SECTION */}
          <section data-trail="#f0ff4a">
            <Section id="achievements" title="Student Achievements">
              <StudentAchievements />
            </Section>
          </section>

          {/* 6. MEMBERS & COORDINATORS SECTION */}
          <section data-trail="#f0ff4a">
            <Section id="members" variant="plain">
              <Members apiBase={API_URL} />
            </Section>
          </section>

          {/* 7. COLLABORATORS SECTION */}
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

          {/* 8. CONTACT SECTION */}
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
      </div>
    </>
  );
}
