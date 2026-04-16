// frontend/src/components/Contact.jsx
import React, { useState } from 'react'
import './Contact.css'

// 👉 Replace the value of MAP_EMBED_SRC with the embed URL you got from Google Maps
const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.101713729154!2d77.03642177481031!3d11.12805238904285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8f9be09f83881%3A0x20dd70b69c2b1b20!2sINFO%20Institute%20Of%20Engineering!5e1!3m2!1sen!2sin!4v1763841499983!5m2!1sen!2sin"

// Normal links are fine (they open in a new tab, not in an iframe)
const MAP_PLACE_LINK =
  'https://maps.app.goo.gl/Nj5e9aHt1wC3e31L6'
const MAP_DIRECTIONS_LINK =
  'https://www.google.com/maps/dir/?api=1&destination=INFO+Institute+of+Engineering,+Kovilpalayam'

export default function Contact({ apiBase = '' }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return

    setStatus('sending')

    try {
      if (apiBase) {
        const res = await fetch(`${apiBase}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        })
        if (!res.ok) throw new Error('Request failed')
      } else {
        console.log('Contact form payload:', form)
      }

      setStatus('success')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 2500)
    } catch (err) {
      console.error(err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2500)
    }
  }

  return (
    <div className="contact-root">
      {/* TOP: info + form grid */}
      <div className="contact-shell">
        {/* left side: title + info chips */}
        <div className="contact-info">
          <h3 className="contact-heading">
            <span className="contact-heading-main">Let&apos;s Connect</span>
            <span className="contact-heading-sub">
              Have an idea, collab, or query? Drop it here.
            </span>
          </h3>

          <div className="contact-taskbar">
            <div className="task-chip">
              <span className="chip-icon">📩</span>
              <div className="task-chip-text">
                <span className="chip-label">Email</span>
                <span className="chip-value">intelliqassociation@gmail.com</span>
              </div>
            </div>

            <div className="task-chip">
              <span className="chip-icon">📍</span>
              <div className="task-chip-text">
                <span className="chip-label">Location</span>
                <span className="chip-value">
                  Info Institute of Engineering, Coimbatore
                </span>
              </div>
            </div>

            <a
              href="https://www.instagram.com/intelliq__info?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              className="task-chip"
              target="_blank"
              rel="noreferrer"
            >
              <span className="chip-icon">📷</span>
              <div className="task-chip-text">
                <span className="chip-label">Instagram</span>
                <span className="chip-value chip-link">
                  @intelliq__info
                </span>
              </div>
            </a>
          </div>

          <p className="contact-small-print">
            We usually respond within 1–2 working days. For urgent college communications,
            reach us via the staff coordinator.
          </p>
        </div>

        {/* right side: form */}
        <div className="contact-form-wrapper">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </div>

              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@college.edu"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us about your idea, event, or question..."
              />
            </div>

            <div className="form-footer">
              <button
                type="submit"
                className="btn btn-neon contact-submit"
                disabled={status === 'sending'}
              >
                {status === 'sending'
                  ? 'Sending...'
                  : status === 'success'
                  ? 'Sent ✓'
                  : status === 'error'
                  ? 'Error – Retry'
                  : 'Send Message'}
              </button>

              <div className={`form-status form-status--${status}`}>
                {status === 'sending' &&
                  'Beep boop… dispatching your message.'}
                {status === 'success' &&
                  'Got it! We will get back to you soon.'}
                {status === 'error' &&
                  'Something went wrong. Please try again in a moment.'}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* BOTTOM: Campus map */}
      <div className="contact-map-wrapper">
        <h3 className="contact-map-title">Campus Location</h3>
        <p className="contact-map-subtitle">
          Find INTELLIQ at INFO Institute of Engineering, Kovilpalayam.
        </p>

        <div className="contact-map-frame">
          <iframe
            title="INFO Institute of Engineering Map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={MAP_EMBED_SRC}
            allowFullScreen
          />
        </div>

        <div className="contact-map-actions">
          <a
            href={MAP_PLACE_LINK}
            target="_blank"
            rel="noreferrer"
            className="contact-map-btn contact-map-btn--primary"
          >
            Open in Google Maps
          </a>
          <a
            href={MAP_DIRECTIONS_LINK}
            target="_blank"
            rel="noreferrer"
            className="contact-map-btn contact-map-btn--ghost"
          >
            Get Directions
          </a>
        </div>
      </div>
    </div>
  )
}