// frontend/src/components/PaymentModal.jsx
import React, { useEffect, useRef } from "react";
import './PaymentModal.css';


export default function PaymentModal({
  open = false,
  onClose = () => {},
  qrPath = "/payments/gpay-qr.png",
  upiId = "ammugowrir@oksbi",      // change to your actual UPI id if you want
  title = "Support INTELLIQ",
  description = "Scan this QR with Google Pay / PhonePe / Paytm to support the club."
}) {
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        // Basic focus trap: keep focus inside modal
        const focusable = dialogRef.current?.querySelectorAll("button, a, [href], input, textarea, [tabindex]:not([tabindex='-1'])");
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKey);
      // focus the close button after open
      setTimeout(() => closeBtnRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const copyUPI = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      // simple feedback via alert or custom toast — using alert for simplicity
      alert("UPI ID copied to clipboard: " + upiId);
    } catch {
      alert("Unable to copy. Please copy the UPI ID manually: " + upiId);
    }
  };

  const openImageNewTab = () => {
    window.open(qrPath, "_blank", "noopener,noreferrer");
  };

  const downloadImage = (e) => {
    // create hidden link to force download
    const a = document.createElement("a");
    a.href = qrPath;
    a.download = qrPath.split("/").pop() || "gpay-qr.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div
      className="payment-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        // click on backdrop closes
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="payment-modal" ref={dialogRef}>
        <header className="payment-modal-header">
          <h3>{title}</h3>
          <button
            ref={closeBtnRef}
            className="btn payment-close"
            aria-label="Close payment dialog"
            onClick={onClose}
          >
            ✕
          </button>
        </header>

        <div className="payment-modal-body">
          <p className="payment-desc">{description}</p>

          <div className="qr-wrap">
            <img src={qrPath} alt="GPay QR code" className="qr-image" />
          </div>

          <div className="payment-hint">
            <div>
              <strong>UPI ID:</strong> <span>{upiId}</span>
            </div>
            <div style={{ marginTop: 6 }}>
              <button className="btn btn-neon small" onClick={copyUPI} aria-label="Copy UPI ID">Copy UPI ID</button>
              <button className="btn btn-ghost small" onClick={openImageNewTab} style={{ marginLeft: 8 }}>Open Image</button>
              <button className="btn btn-ghost small" onClick={downloadImage} style={{ marginLeft: 8 }}>Download QR</button>
            </div>
          </div>
        </div>

        <footer className="payment-modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
  );
}
