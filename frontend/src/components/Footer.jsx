import React from "react";
import footerLogo from "../assests/logo.png";  // ✅ Correct local asset path
import './Footer.css';


export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-brand">
          <img
            src={footerLogo}   // ✅ Correct usage of imported asset
            alt="INTELLIQ logo"
            className="footer-logo"
            width="50"
            height="50"
          />
          <div>
            <h3>INTELLIQ</h3>
            <p>
              The Association of Artificial Intelligence & Data Science — fostering innovation,
              intelligence, and collaboration for the future.
            </p>
          </div>
        </div>

        {/* Explore Section */}
        <div className="footer-column">
          <h4>Explore</h4>
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#events">Events</a></li>
            <li><a href="#members">Team</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* Connect Section */}
        <div className="footer-column">
          <h4>Connect</h4>
          <ul>
            <li>
              <a
                href="https://linkedin.com/company/intelliq"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/intelliq__info?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=intelliqassociation@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Email Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          Made with ❤️ by students || © {new Date().getFullYear()} <strong>INTELLIQ</strong> • All rights reserved.
        </p>
      </div>
    </footer>
  );
}
