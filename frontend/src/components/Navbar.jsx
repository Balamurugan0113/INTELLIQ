// frontend/src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import './Navbar.css';

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
    focusable: false,
  };

  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5z"
                stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "events":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M16 3v4M8 3v4M3 9h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "members":
      return (
        <svg {...common}>
          <circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
          <path d="M5 20v-2.5C5 15.57 7.239 14 10 14h4c2.761 0 5 1.57 5 3.5V20"
                stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "about":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 8v.01M11 12h1v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "vision":
      return (
        <svg {...common}>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "posters":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 15l5-5 4 4 5-5 4 4M14 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "achievements":
      return (
        <svg {...common}>
          <path d="M8 21h8M12 17v4M6 4h12v5a6 6 0 0 1-12 0V4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 6H4a2 2 0 0 0-2 2v1a3 3 0 0 0 3 3h1M18 6h2a2 2 0 0 1 2 2v1a3 3 0 0 1-3 3h-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "contact":
      return (
        <svg {...common}>
          <rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M2 6l10 7 10-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navRef = useRef(null);

  const NAV_ITEMS = [
    { id: "home", href: "#home", label: "Home", icon: "home" },
    { id: "about", href: "#about", label: "About", icon: "about" },
    { id: "vision", href: "#vision", label: "Vision", icon: "vision" },
    { id: "posters", href: "#posters", label: "Posters", icon: "posters" },
    { id: "events", href: "#events", label: "Events", icon: "events" },
    { id: "achievements", href: "#achievements", label: "Achievements", icon: "achievements" },
    { id: "members", href: "#members", label: "Members", icon: "members" },
    { id: "contact", href: "#contact", label: "Contact", icon: "contact" },
  ];

  // 1. Scroll listener for navbar shrink & active section scroll-spy
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        setShrink(scrollY > 50);

        // Detect current section in viewport
        const offset = 180;
        let current = "home";

        for (const item of NAV_ITEMS) {
          const el = document.getElementById(item.id);
          if (el) {
            const top = el.offsetTop - offset;
            if (scrollY >= top) {
              current = item.id;
            }
          }
        }
        setActiveSection(current);
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Close mobile menu on Escape key or outside click
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && open) setOpen(false);
    };

    const handleClickOutside = (e) => {
      if (!open) return;
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [open]);

  // 3. Smooth scrolling when clicking nav links
  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    setActiveSection(targetId);
    setOpen(false);

    if (targetId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const navHeight = 72;
      const elPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
      const offsetPos = Math.max(0, elPosition - navHeight);

      window.scrollTo({
        top: offsetPos,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`nav ${shrink ? "nav--shrink" : ""}`}
        role="navigation"
        aria-label="Primary navigation"
      >
        <div className="nav-inner">
          {/* Brand Logo & Name */}
          <a
            className="brand"
            href="#home"
            onClick={(e) => handleLinkClick(e, "home")}
            aria-label="INTELLIQ — Home"
          >
            <img
              className="brand-logo neon"
              src="/Logo.png"
              srcSet="/Logo.png 1x, /logo@2x.png 2x"
              width="36"
              height="36"
              alt="INTELLIQ logo"
              loading="eager"
            />
            <span className="brand-text">INTELLIQ</span>
          </a>

          {/* Nav Right (Links & Mobile Toggle) */}
          <div className="nav-right">
            {/* Desktop Navigation Links */}
            <div
              id="menu"
              className={`tabs ${open ? "open" : ""}`}
              role="menubar"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`tab ${isActive ? "active" : ""}`}
                    aria-label={item.label}
                    title={item.label}
                    role="menuitem"
                    onClick={(e) => handleLinkClick(e, item.id)}
                  >
                    <Icon name={item.icon} />
                    <span className="tab-label">{item.label}</span>
                    {isActive && <span className="tab-active-dot" aria-hidden="true" />}
                  </a>
                );
              })}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className={`tab menu-toggle ${open ? "is-active" : ""}`}
              aria-expanded={open}
              aria-controls="menu"
              onClick={() => setOpen((prev) => !prev)}
              aria-label={open ? "Close menu" : "Open menu"}
              title={open ? "Close menu" : "Open menu"}
            >
              <Icon name={open ? "close" : "menu"} size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop */}
      {open && (
        <div
          className="nav-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
