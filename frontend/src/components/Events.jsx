// frontend/src/components/Events.jsx
import React, { useEffect, useMemo, useState } from 'react'
import './Events.css'

// smooth 3D tilt helpers
function handleCardMouseMove(ev) {
  const card = ev.currentTarget
  const rect = card.getBoundingClientRect()

  // normalize cursor position between 0 and 1
  const x = (ev.clientX - rect.left) / rect.width
  const y = (ev.clientY - rect.top) / rect.height

  // tilt limits
  const rotateX = (0.5 - y) * 10 // up/down
  const rotateY = (x - 0.5) * 16 // left/right

  // use rAF per card to avoid spamming style writes
  if (card.__tiltRaf) cancelAnimationFrame(card.__tiltRaf)
  card.__tiltRaf = requestAnimationFrame(() => {
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
  })
}

function handleCardMouseLeave(ev) {
  const card = ev.currentTarget

  if (card.__tiltRaf) {
    cancelAnimationFrame(card.__tiltRaf)
    card.__tiltRaf = null
  }

  // snap back smoothly
  card.style.transition = 'transform 200ms ease-out'
  card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)'

  // remove the temporary transition after it finishes
  setTimeout(() => {
    card.style.transition = ''
  }, 220)
}

export default function Events({ apiBase }) {
  const [events, setEvents] = useState([])
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    if (!apiBase) return
    fetch(`${apiBase}/api/events`)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(d => {
        if (Array.isArray(d) && d.length) setEvents(d)
      })
  }, [apiBase])

  const show = useMemo(() => {
    if (filter === 'All') return events
    return events.filter(e => e.type.toLowerCase() === filter.toLowerCase())
  }, [events, filter])

  const chips = ['All', 'Workshop', 'Talk', 'Hackathon']

  return (
    <section
      /* removed id="events" to avoid duplicate IDs with <Section id="events" /> */
      aria-labelledby="events-heading"
      className="events-section"
    >
      <div className="events-container">
        {/* Filters row */}
        <div className="events-filters-row">
          <div className="event-filters">
            {chips.map(c => (
              <button
                key={c}
                type="button"
                className={`event-filter-btn ${
                  filter === c ? 'is-active' : ''
                }`}
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <div className="events-grid">
          {show.length === 0 ? (
            <div className="events-empty">
              No upcoming events.
            </div>
          ) : (
            show.map(e => (
              <article
                key={e.id}
                className="card event-card"
                data-type={e.type}
                role="article"
                aria-label={e.title}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                <h3>
                  {e.title}
                  <span className="badge">{e.type}</span>
                </h3>
                <div className="meta">
                  {new Date(e.date).toDateString()}
                </div>
                <p>{e.description}</p>
              </article>
            )) 
          )}
        </div>
      </div>
    </section>
  )
}