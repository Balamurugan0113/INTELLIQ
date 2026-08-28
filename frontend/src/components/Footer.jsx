import React from "react";
import footerLogo from "../assests/logo.png";
import { FaLinkedin, FaInstagram, FaEnvelope, FaHeart } from "react-icons/fa";
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-compact">
      <div className="footer-inner">
        {/* Brand Micro-Block */}
        <div className="footer-brand-micro">
          <img
            src={footerLogo}
            alt="INTELLIQ logo"
            className="footer-logo-mini"
            width="38"
            height="38"
          />
          <div className="footer-brand-text">
            <span className="brand-name-yellow">INTELLIQ</span>
            <span className="brand-tagline-sub">AI &amp; DS Association</span>
          </div>
        </div>

        {/* Inline Navigation Links */}
        <nav className="footer-nav-links" aria-label="Footer navigation">
          <a href="#about">About</a>
          <a href="#vision">Vision</a>
          <a href="#events">Events</a>
          <a href="#achievements">Achievements</a>
          <a href="#members">Members</a>
          <a href="#contact">Contact</a>
        </nav>

        {/* Social Chips */}
        <div className="footer-social-chips">
          <a
            href="https://linkedin.com/company/intelliq"
            target="_blank"
            rel="noopener noreferrer"
            className="social-chip"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
            <span>LinkedIn</span>
          </a>
          <a
            href="https://www.instagram.com/intelliq__info?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="social-chip"
            aria-label="Instagram"
          >
            <FaInstagram />
            <span>Instagram</span>
          </a>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=intelliqassociation@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-chip"
            aria-label="Email"
          >
            <FaEnvelope />
            <span>Email</span>
          </a>
        </div>
      </div>

      <div className="footer-bottom-mini">
        <p>
          Made with <FaHeart style={{ color: '#ff3de8', margin: '0 4px', fontSize: '0.75rem' }} /> by students || &copy; {new Date().getFullYear()} <strong style={{ color: '#f0ff4a' }}>INTELLIQ</strong>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
