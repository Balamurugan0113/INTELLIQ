// frontend/src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import './Navbar.css';

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
    default:
      return null;
  }
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 769 : false);
  const tickingRef = useRef(false);
  const navRef = useRef(null);

  useEffect(() => {
    // scroll handler (shrink navbar)
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        setShrink(window.scrollY > 80);
        tickingRef.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // matchMedia handler for mobile detection and responsive behavior
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => {
      const mobile = mq.matches;
      setIsMobile(mobile);
      if (!mobile) {
        // if switching to desktop, ensure menu is closed
        setOpen(false);
      }
    };

    update();
    // modern API
    if (mq.addEventListener) mq.addEventListener("change", update);
    else mq.addListener(update);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update);
      else mq.removeListener(update);
    };
  }, []);

  useEffect(() => {
    // close menu on Escape key and close when clicking outside nav
    const onKey = (e) => {
      if (e.key === "Escape" && open) setOpen(false);
    };

    const onClick = (e) => {
      if (!open) return;
      const navEl = navRef.current;
      if (!navEl) return;
      if (!navEl.contains(e.target)) setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick, true);
    };
  }, [open]);

  const NAV_ITEMS = [
    { id: "home", href: "#home", label: "Home", icon: "home" },
    { id: "events", href: "#events", label: "Events", icon: "events" },
    { id: "members", href: "#members", label: "Members", icon: "members" },
    { id: "about", href: "#about", label: "About", icon: "about" },
    { id: "contact", href: "#contact", label: "Contact", icon: "contact" },
  ];

  // When a nav link is clicked, close mobile menu (keeps desktop unchanged)
  const handleLinkClick = () => {
    if (isMobile) setOpen(false);
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

          <div className="nav-right">
            <button
              className="tab menu-toggle"
              aria-expanded={open}
              aria-controls="menu"
              onClick={() => setOpen(v => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              title={open ? "Close menu" : "Open menu"}
            >
              <Icon name="menu" />
            </button>

            {/* aria-hidden depends on whether we're on mobile; desktop always exposes menu */}
            <div
              id="menu"
              className={`tabs ${open ? "open" : ""}`}
              role="menubar"
              aria-hidden={isMobile ? !open : false}
            >
              {NAV_ITEMS.map(item => (
                <a
                  key={item.id}
                  href={item.href}
                  className="tab"
                  aria-label={item.label}
                  title={item.label}
                  role="menuitem"
                  onClick={handleLinkClick}
                >
                  <Icon name={item.icon} />
                  <span className="tab-label">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
