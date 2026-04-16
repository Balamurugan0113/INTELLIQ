// frontend/src/components/Map.jsx
import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './Map.css' // ensure this defines .map-wrap and responsive heights

// keep default icon fallback mapping (still okay if present)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png'
})

// Create a divIcon with the animated HTML (no image assets required)
const intelliqIcon = L.divIcon({
  className: '', // we rely on inner markup + CSS
  html: `
    <div class="intelliq-marker" role="img" aria-label="INTELLIQ location marker">
      <div class="pulse-2"></div>
      <div class="pulse"></div>
      <div class="core"></div>
      <div class="inner"></div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -14],
})

export default function Map({
  center = [10.891514, 76.990829],
  popupTitle = 'Institute Location',
  lazy = true,              // whether to lazy-mount map tiles
  rootMargin = '200px'      // when to start loading the map
}) {
  const zoom = 14
  const wrapperRef = useRef(null)
  const [mounted, setMounted] = useState(!lazy) // if not lazy, mount immediately

  useEffect(() => {
    if (!lazy) return undefined
    const el = wrapperRef.current
    if (!el) {
      setMounted(true)
      return undefined
    }
    if (!('IntersectionObserver' in window)) {
      setMounted(true)
      return undefined
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setMounted(true)
            io.disconnect()
          }
        })
      },
      { root: null, rootMargin, threshold: 0.02 }
    )
    io.observe(el)
    return () => {
      try { io.disconnect() } catch (e) {}
    }
  }, [lazy, rootMargin])

  return (
    <div className="map-wrap" ref={wrapperRef} aria-label={`Map: ${popupTitle}`}>
      {mounted ? (
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          aria-label={`Map showing ${popupTitle}`}
        >
          <ZoomControl position="bottomright" />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={center} icon={intelliqIcon}>
            <Popup>
              <strong>{popupTitle}</strong><br/>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.join(','))}`}
              >
                Open in Google Maps
              </a>
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        // lightweight placeholder to maintain layout and accessibility until map mounts
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
          <div style={{ opacity: 0.6, fontSize: 13 }}>Loading map…</div>
        </div>
      )}
    </div>
  )
}
