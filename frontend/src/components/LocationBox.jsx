// frontend/src/components/LocationBox.jsx
import React from "react";

export default function LocationBox({
  placeQuery = "Institute of Engineering Coimbatore",
  label = "Institute of Engineering, Coimbatore",
  phone = "",
}) {
  const q = encodeURIComponent(placeQuery);

  // embed / fallback src (works without an API key)
  const embedSrc = `https://www.google.com/maps?q=${q}&output=embed&t=m`;

  // direct google maps (opening in new tab)
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;

  // simple phone tel link
  const telHref = phone ? `tel:${phone.replace(/\s+/g, "")}` : null;

  // Inline styles to keep this self-contained and mobile-friendly
  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(180deg, rgba(10,10,15,1), rgba(5,5,8,1))",
      color: "#E6F5E5",
      fontFamily: "Inter, system-ui, sans-serif",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },
    topBar: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 14px",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      background:
        "linear-gradient(180deg, rgba(6,6,8,0.95), rgba(6,6,8,0.88))",
      zIndex: 30,
    },
    backBtn: {
      appearance: "none",
      border: "none",
      background: "transparent",
      color: "inherit",
      fontSize: 18,
      padding: "8px",
      borderRadius: 10,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    },
    titleWrap: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      minWidth: 0,
    },
    title: {
      margin: 0,
      fontSize: 16,
      fontWeight: 700,
      letterSpacing: 0.4,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    subtitle: {
      margin: 0,
      fontSize: 12,
      opacity: 0.8,
    },
    mapWrap: {
      flex: 1,
      position: "relative",
      display: "block",
      width: "100%",
      height: "100%",
      minHeight: 320,
      background: "#0b0b0d",
    },
    iframe: {
      border: 0,
      width: "100%",
      height: "100vh", // we'll offset visually with absolute top bar; mobile browsers handle viewport changes
      display: "block",
    },
    bottomBar: {
      position: "fixed",
      left: 12,
      right: 12,
      bottom: 16,
      zIndex: 40,
      display: "flex",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      pointerEvents: "auto",
    },
    actionBtn: {
      flex: "1 1 auto",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      minHeight: 48,
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.06)",
      background:
        "linear-gradient(90deg, rgba(0,255,240,0.06), rgba(156,107,255,0.04))",
      color: "#EAFBF9",
      textDecoration: "none",
      fontWeight: 600,
      fontSize: 15,
      boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
    },
    smallNote: {
      position: "fixed",
      left: 12,
      bottom: 74,
      zIndex: 39,
      fontSize: 12,
      opacity: 0.9,
      color: "rgba(230,245,229,0.85)",
      background: "rgba(0,0,0,0.32)",
      border: "1px solid rgba(255,255,255,0.03)",
      padding: "8px 10px",
      borderRadius: 10,
    },
  };

  // Back action
  const onBack = () => {
    try {
      // go back if history has length, otherwise close window/tab
      if (window.history.length > 1) window.history.back();
      else window.close();
    } catch (e) {
      // fallback: navigate to root
      window.location.href = "/";
    }
  };

  return (
    <div style={styles.page} role="main" aria-label="Location page">
      <header style={styles.topBar} role="banner">
        <button
          onClick={onBack}
          aria-label="Go back"
          title="Back"
          style={styles.backBtn}
        >
          {/* simple chevron icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div style={styles.titleWrap}>
          <h1 style={styles.title}>{label}</h1>
          <div style={styles.subtitle}>{placeQuery}</div>
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open in Google Maps"
          title="Open in Google Maps"
          style={{
            marginLeft: 10,
            color: "inherit",
            textDecoration: "none",
            fontSize: 14,
            opacity: 0.95,
            border: "none",
            background: "transparent",
          }}
        >
          Open
        </a>
      </header>

      {/* Map area - we intentionally let the iframe occupy the viewport; top bar sits above visually */}
      <div style={styles.mapWrap} aria-hidden="false">
        <iframe
          title={`Map: ${label}`}
          src={embedSrc}
          style={styles.iframe}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      {/* informational small note (above sticky actions) */}
      <div style={styles.smallNote} aria-hidden="true">
        Tap the actions below for directions or to open in Google Maps.
      </div>

      {/* sticky bottom actions (mobile-friendly) */}
      <nav style={styles.bottomBar} role="navigation" aria-label="Location actions">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.actionBtn}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Directions
        </a>

        <a
          href={telHref || mapsUrl}
          style={{
            ...styles.actionBtn,
            minWidth: 120,
            maxWidth: 160,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
            <path d="M22 16.92V21a1 1 0 0 1-1.11 1A19 19 0 0 1 3 4.11 1 1 0 0 1 4 3h4.09a1 1 0 0 1 1 .75c.12.7.38 1.86.86 2.9a1 1 0 0 1-.24 1l-1.27 1.27a16 16 0 0 0 6.6 6.6l1.28-1.28a1 1 0 0 1 1-.24c1.05.48 2.2.74 2.9.86a1 1 0 0 1 .74 1z" stroke="currentColor" strokeWidth="1.0" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {phone ? "Call" : "Open"}
        </a>
      </nav>
    </div>
  );
}
