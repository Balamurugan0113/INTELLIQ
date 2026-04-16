// frontend/src/components/ResponsiveNavbar.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * ResponsiveNavbar
 * - Uses the same CSS classes you already have in styles.css
 * - No external UI libs (no @mui)
 * - Accessible toggle, shrink-on-scroll behaviour, and keyboard support
 */

function Icon({ name, size = 20 }) {
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
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "events":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
          <path d="M16 3v4M8 3v4M3 9h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "members":
      return (
        <svg {...common}>
          <circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 20v-2.5C5 15.57 7.239 14 10 14h4c2.761 0 5 1.57 5 3.5V20"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "about":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
          <path d="M12 8v.01M11 12h1v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "contact":
      return (
        <svg {...common}>
          <rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
          <path d="M2 6l10 7 10-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ResponsiveNavbar() {
  const [open, setOpen] = useState(false);
  const [shrink, setShrink] = useState(false);
  const navRef = useRef(null);
  const ticking = useRef(false);

  const NAV_ITEMS = [
    { id: "home", href: "#home", label: "Home", icon: "home" },
    { id: "events", href: "#events", label: "Events", icon: "events" },
    { id: "members", href: "#members", label: "Members", icon: "members" },
    { id: "about", href: "#about", label: "About", icon: "about" },
    { id: "contact", href: "#contact", label: "Contact", icon: "contact" },
  ];

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setShrink(window.scrollY > 80);
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close menu on outside click or on resize (mobile -> desktop)
  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target)) setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 768 && open) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      document.removeEventListener("click", onDocClick);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // keyboard: Esc closes
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <nav
        ref={navRef}
        className={`nav ${shrink ? "nav--shrink" : ""} ${open ? "nav--open" : ""}`}
        role="navigation"
        aria-label="Primary navigation"
      >
        <div className="nav-inner">
          <a className="brand" href="#home" aria-label="INTELLIQ — Home">
            <img
              className="brand-logo neon"
              src="/logo.png"
              srcSet="/logo.png 1x, /logo@2x.png 2x"
              width="36"
              height="36"
              alt="INTELLIQ logo"
              loading="eager"
              decoding="async"
            />
            <span className="brand-text">INTELLIQ</span>
          </a>

          <div className="nav-right" role="none">
            {/* Menu toggle for mobile */}
            <button
              className="tab menu-toggle"
              aria-expanded={open}
              aria-controls="primary-menu"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              title={open ? "Close menu" : "Open menu"}
              type="button"
            >
              <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
              {open ? <Icon name="close" /> : <Icon name="menu" />}
            </button>

            {/* Menu items */}
            <div
              id="primary-menu"
              className={`tabs ${open ? "open" : ""}`}
              role="menubar"
              aria-hidden={!open && window.innerWidth < 769}
            >
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="tab"
                  aria-label={item.label}
                  title={item.label}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  <Icon name={item.icon} />
                  <span className="tab-label">{item.label}</span>
                </a>
              ))}

              {/* small CTA shown as part of tabs on mobile */}
              <a
                href="#contact"
                className="tab"
                role="menuitem"
                aria-label="Contact"
                onClick={() => setOpen(false)}
                title="Contact"
              >
                <Icon name="contact" />
                <span className="tab-label">Contact</span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
