// frontend/src/App.jsx
import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Section from './components/Section'
import Events from './components/Events'
import Members from './components/Members'
import About from './components/About'
import LogoFadeLoop from './components/LogoFadeLoop'
import Contact from './components/Contact'
import PaymentModal from './components/PaymentModal'
import Footer from './components/Footer'
import Hero from './components/Hero'
import CanvasWaterFluidCursor from "@/components/ui/canvas-water-fluid-cursor";
import OverlayControls from './components/OverlayControls';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App() {
  const [supportOpen, setSupportOpen] = useState(false)

  return (
    <>
      {/* SPLASH CURSOR TRAIL  */}
      <CanvasWaterFluidCursor blur={16} coreSize={1.8} maxDrops={75} />
      {/* All content above the canvas */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />
        <main id="content">
          {/* HERO SECTION */}
          <section data-trail="#01cefc">
            <Hero />
          </section>

          {/* EVENTS */}
          <section data-trail="#ffc74d">
            <Section id="events" title="Events">
              <Events apiBase={API_URL} />
            </Section>
          </section>

          {/* MEMBERS */}
          <section data-trail="#ff3de8">
            <Section id="members" title="Members">
              <Members apiBase={API_URL} />
            </Section>
          </section>

          {/* ABOUT */}
          <section data-trail="#f0ff4a">
            <Section id="about" title="About INTELLIQ">
              <About />
            </Section>
          </section>

          {/* COLLABORATORS */}
          <section id="collaborators" variant="compact" data-trail="#37ff00">
            <LogoFadeLoop
              images={[
                "/logos/logo1.png",
                "/logos/logo2.png",
                "/logos/logo3.png",
                "/logos/logo4.png",
                "/logos/logo5.png",
                "/logos/logo6.png",
              ]}
              title="OUR COLLABORATORS"
              speed={10}
            />
          </section>

          {/* CONTACT */}
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
  )
}
