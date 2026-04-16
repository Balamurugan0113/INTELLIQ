import React, { useState, useRef, useEffect } from "react";
import "./Hero.css";
import { FaChevronUp } from "react-icons/fa";
import { FaUsers, FaRocket, FaLightbulb } from "react-icons/fa";
import PaymentModal from "./PaymentModal";
import gsap from "gsap";

export default function Hero() {
  const backToTopRef = useRef(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  
  const titleRef = useRef(null);
  const taglineRef = useRef(null);

  // show/hide back to top button on scroll
  useEffect(() => {
    const el = backToTopRef.current;
    if (!el) return;

    const onScroll = () => {
      if (window.scrollY > 400) el.classList.add("show");
      else el.classList.remove("show");
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Text Animations
  useEffect(() => {
    // Animate INTELLIQ characters with a cinematic vertical zoom
    if (titleRef.current) {
      const chars = titleRef.current.children;
      gsap.fromTo(chars, 
        { opacity: 0, y: 30, scale: 1.2 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.15, duration: 1.2, ease: "power3.out", delay: 0.2 }
      );
    }
    
    // Animate WEFALLWERISEWEHOWL words loop
    if (taglineRef.current) {
      const words = taglineRef.current.children;
      const tl = gsap.timeline({ repeat: -1 });
      
      Array.from(words).forEach((word) => {
        tl.fromTo(word,
          { opacity: 0, scale: 0.95, textShadow: "0 0 0px #e8ff4d" },
          { opacity: 1, scale: 1.05, textShadow: "0 0 20px #e8ff4d", duration: 1.0, ease: "power2.out" }
        )
        .to(word, { opacity: 0, scale: 1, textShadow: "0 0 0px #e8ff4d", duration: 0.8, ease: "power2.in" }, "+=0.8");
      });
    }
  }, []);

  return (
    <section className="hero" id="home" aria-label="Hero section">
      {/* CINEMATIC VIDEO BACKGROUND */}
      <video className="hero-video-bg" autoPlay loop muted playsInline poster="/hero-image.png">
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay"></div>

      {/* Main Content Overlay */}
      <div className="hero-inner-block">
        {/* Title row */}
        <div className="hero-title-row">
          <h1 className="hero-main-title">
            <span className="hero-main-glow" ref={titleRef} style={{ display: "inline-flex" }}>
              {"INTELLIQ".split("").map((char, index) => (
                <span key={index} style={{ opacity: 0 }}>{char}</span>
              ))}
            </span>
          </h1>

          <div className="hero-pill">
            <span className="pill-dot" />
            <span className="pill-text">AI &amp; DS ASSOCIATION</span>
          </div>
        </div>

        {/* Typewriter Line */}
        <p className="hero-typewriter-line">Innovation Through Unity</p>

        {/* Subtitle */}
        <p className="hero-sub">
          A revolutionary student-built ecosystem where AI curiosity becomes innovation — from tiny
          models to campus-scale breakthroughs.
        </p>

        {/* Icon Feature Row */}
        <div className="hero-icon-row">
          <div className="hero-icon-pill">
            <FaRocket />
            <span>Hands-on Projects</span>
          </div>
          <div className="hero-icon-pill">
            <FaUsers />
            <span>Peer Community</span>
          </div>
          <div className="hero-icon-pill">
            <FaLightbulb />
            <span>Idea Labs &amp; Talks</span>
          </div>
        </div>

        {/* Animated Tagline Loop */}
        <div className="hero-tagline-big">
          <div ref={taglineRef} style={{ position: "relative", height: "60px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "2.5rem", letterSpacing: "8px", fontWeight: "bold", textAlign: "center", marginTop: "30px", color: "#e8ff4d" }}>
            {["WE FALL", "WE RISE", "WE HOWL"].map((phrase, index) => (
              <span key={index} style={{ position: "absolute", opacity: 0 }}>{phrase}</span>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="hero-cta-row cta-row-combined">
          <a className="btn btn-neon" href="#contact">
            Contact Us
          </a>

          <button
            type="button"
            className="payment-btn"
            onClick={() => setPaymentOpen(true)}
            aria-haspopup="dialog"
            aria-controls="payment-modal"
            aria-expanded={paymentOpen}
          >
            <span className="label-highlight">Support</span>
          </button>
        </div>
      </div>

      {/* BACK TO TOP BUTTON */}
      <button
        ref={backToTopRef}
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <FaChevronUp />
      </button>

      {/* Payment Modal */}
      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        qrPath="/payments/gpay-qr.png"
        upiId="ammugowrir@oksbi"
        title="Support INTELLIQ"
        description="Scan this QR with Google Pay / PhonePe / Paytm to support the club."
      />
    </section>
  );
}
