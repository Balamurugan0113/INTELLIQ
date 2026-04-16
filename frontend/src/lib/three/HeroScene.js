// frontend/src/lib/three/HeroScene.js
import * as THREE from 'three'

// Served from public folder so path is always stable:
const HERO_IMAGE = '/hero-image.png'
const LOGO_OPACITY = 0.35 // keep original visual blending

// Helper: clamp DPR so we don't ask for enormous render targets
const clampDPR = (dpr) => Math.min(Math.max(1, dpr || 1), 2)

/**
 * initHeroScene(container)
 * - container: DOM element to mount canvas into (should be the hero-canvas wrapper)
 * - returns: cleanup function () => void
 */
export function initHeroScene(container) {
  if (!container) {
    // return a no-op cleanup for safety
    return () => {}
  }

  // per-instance state (avoids module globals)
  const state = {
    renderer: null,
    scene: null,
    camera: null,
    rafId: null,
    resizeObserver: null,
    listeners: [],
    mesh: null,
    group: null,
    reduceMotion: false,
    heroAncestor: null
  }

  try {
    state.reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // attach a marker class to nearest .hero ancestor so CSS fallback hides
    const findHeroAncestor = (el) => {
      let p = el
      while (p && p !== document.documentElement) {
        if (p.classList && p.classList.contains('hero')) return p
        p = p.parentElement
      }
      return null
    }
    const heroAncestor = findHeroAncestor(container)
    state.heroAncestor = heroAncestor
    if (heroAncestor) heroAncestor.classList.add('hero-has-canvas')

    // create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.domElement.style.pointerEvents = 'none'
    renderer.setClearColor(0x000000, 0) // transparent background
    // use sRGB encoding for nicer colors
    try { renderer.outputEncoding = THREE.sRGBEncoding } catch (e) {}
    state.renderer = renderer
    container.appendChild(renderer.domElement)

    // scene & camera
    const scene = new THREE.Scene()
    state.scene = scene

    const getSize = () => {
      // prefer container size; fallback to window
      const rect = container.getBoundingClientRect()
      const w = Math.max(1, Math.round(rect.width) || window.innerWidth || 1)
      const h = Math.max(1, Math.round(rect.height) || window.innerHeight || 1)
      return { w, h, rect }
    }

    const { w: initialW, h: initialH } = getSize()
    // use perspective camera; we'll nudge z-distance on resize to keep logo stable
    const camera = new THREE.PerspectiveCamera(45, initialW / initialH, 0.1, 100)
    camera.position.set(0, 0, 6) // starting distance
    camera.lookAt(0, 0, 0)
    state.camera = camera

    // group (parallax). Keep mesh at origin inside group so it's centered visually.
    const group = new THREE.Group()
    group.position.set(0, 0, 0)
    state.group = group
    scene.add(group)

    // plane geometry sized for hero presence (keeps your previous proportions)
    const planeHeight = 4.2
    const planeWidth = planeHeight * (16 / 9)
    const geo = new THREE.PlaneGeometry(planeWidth, planeHeight, 1, 1)

    // load texture and create mesh when available
    const loader = new THREE.TextureLoader()
    const tex = loader.load(
      HERO_IMAGE,
      (t) => {
        // ensure color-space (sRGB) if available
        try {
          if ('colorSpace' in t) t.colorSpace = THREE.SRGBColorSpace
        } catch (e) {}
        t.anisotropy = renderer.capabilities?.getMaxAnisotropy?.() || 4

        const mat = new THREE.MeshBasicMaterial({
          map: t,
          transparent: true,
          opacity: LOGO_OPACITY,
          depthWrite: false
        })

        const mesh = new THREE.Mesh(geo, mat)
        mesh.renderOrder = -1

        // ensure the logo sits at center of the group, not offset
        mesh.position.set(0, 0, 0)
        mesh.rotation.set(0, 0, 0)
        mesh.scale.set(1, 1, 1)

        state.mesh = mesh
        group.add(mesh)

        // if you have a second static image DOM element accidentally placed, ensure it's hidden:
        // (NOT removing DOM elements—only hiding fallback via hero-has-canvas is recommended)
      },
      undefined,
      (err) => {
        // eslint-disable-next-line no-console
        console.error('[HeroScene] Failed to load hero texture:', HERO_IMAGE, err)
      }
    )

    // pointer handling scoped to container (safer)
    const pointer = new THREE.Vector2(0, 0)
    const onPointerMove = (e) => {
      // use bounding rect to map pointer relative to element
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1
      const y = -((e.clientY - rect.top) / (rect.height || 1)) * 2 + 1
      pointer.set(x, y)
    }
    container.addEventListener('pointermove', onPointerMove, { passive: true })
    state.listeners.push({ target: container, type: 'pointermove', fn: onPointerMove, opts: { passive: true } })

    // resize handling (ResizeObserver preferred)
    const handleResize = () => {
      const { w, h } = getSize()
      const dpr = clampDPR(window.devicePixelRatio)
      renderer.setPixelRatio(dpr)
      renderer.setSize(w, h, false)

      // reposition camera to keep plane nicely framed across aspect ratios
      // simple heuristic: adjust camera.z based on aspect so centered logo fills similar screen area
      const aspect = w / Math.max(h, 1)
      // smaller aspect => need to move camera slightly backwards; wider aspect => slightly forward
      const baseZ = 6
      const z = baseZ + Math.max(0, (1.2 - Math.min(1.8, aspect)) * 2.2)
      camera.position.set(0, 0, z)
      camera.aspect = w / Math.max(h, 1)
      camera.updateProjectionMatrix()

      // If mesh exists, keep it at origin (center). But we can slightly scale the mesh based on container height
      if (state.mesh) {
        // scale down on narrow/tall containers (mobile) so it doesn't feel off-center
        const scaleBase = Math.min(1.15, Math.max(0.7, Math.min(1.15, h / 420)))
        state.mesh.scale.setScalar(scaleBase)
        // keep mesh positioned at group origin (0,0,0) so visually centered
        state.mesh.position.set(0, 0, 0)
      }
      // ensure group remains near origin; small vertical nudge for better framing on short screens
      group.position.y = 0
      group.position.x = 0
    }

    if (typeof ResizeObserver !== 'undefined') {
      state.resizeObserver = new ResizeObserver(() => {
        // tiny debounce to let layout settle
        setTimeout(handleResize, 40)
      })
      state.resizeObserver.observe(container)
    } else {
      const onWinResize = () => setTimeout(handleResize, 60)
      window.addEventListener('resize', onWinResize, { passive: true })
      state.listeners.push({ target: window, type: 'resize', fn: onWinResize, opts: { passive: true } })
    }

    // initial size
    handleResize()

    // subtle idle rotation (apply to group not mesh so mesh stays centered but can float/rotate subtly)
    let last = performance.now()
    const animate = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      if (!state.reduceMotion && state.group) {
        // parallax from pointer (very subtle)
        const targetX = pointer.y * 0.08
        const targetY = pointer.x * 0.12
        state.group.rotation.x += (targetX - state.group.rotation.x) * 0.06
        state.group.rotation.y += (targetY - state.group.rotation.y) * 0.06
      } else if (state.group) {
        // gentle debounce toward identity rotation if prefers reduced motion
        state.group.rotation.x += (0 - state.group.rotation.x) * 0.06
        state.group.rotation.y += (0 - state.group.rotation.y) * 0.06
      }

      // floating motion on group (keeps mesh visually centered but lively)
      if (state.group) {
        state.group.position.y = Math.sin(now * 0.0006) * 0.02
      }

      renderer.render(scene, camera)
      state.rafId = requestAnimationFrame(animate)
    }
    state.rafId = requestAnimationFrame(animate)

    // cleanup function
    const cleanup = () => {
      try {
        if (state.rafId) {
          cancelAnimationFrame(state.rafId)
          state.rafId = null
        }

        if (state.resizeObserver) {
          try { state.resizeObserver.disconnect() } catch (_) {}
          state.resizeObserver = null
        }

        // remove listeners
        state.listeners.forEach(({ target, type, fn, opts }) => {
          try { target.removeEventListener(type, fn, opts) } catch (e) { /* ignore */ }
        })
        state.listeners = []

        // remove canvas DOM
        if (state.renderer) {
          try {
            const dom = state.renderer.domElement
            if (dom && dom.parentElement) dom.parentElement.removeChild(dom)
          } catch (e) {}

          try { state.renderer.forceContextLoss?.() } catch (e) {}
          try { state.renderer.dispose?.() } catch (e) {}
          state.renderer = null
        }

        // dispose mesh materials/geometries/textures
        if (state.mesh) {
          try {
            state.mesh.geometry?.dispose?.()
            const mat = state.mesh.material
            if (mat) {
              if (Array.isArray(mat)) mat.forEach(m => { m.map?.dispose?.(); m.dispose?.() })
              else { mat.map?.dispose?.(); mat.dispose?.() }
            }
          } catch (e) {}
          state.mesh = null
        }

        // traverse scene to dispose any remaining resources
        try {
          if (state.scene) {
            state.scene.traverse((obj) => {
              if (obj.isMesh) {
                obj.geometry?.dispose?.()
                if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose?.())
                else obj.material?.dispose?.()
              }
              if (obj.isPoints) {
                obj.geometry?.dispose?.()
                obj.material?.dispose?.()
              }
            })
          }
        } catch (e) {}

        // remove hero marker class so fallback returns
        if (state.heroAncestor) {
          try { state.heroAncestor.classList.remove('hero-has-canvas') } catch (e) {}
          state.heroAncestor = null
        }

        state.scene = null
        state.camera = null
        state.group = null
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[HeroScene] cleanup error', err)
      }
    }

    // return cleanup function
    return cleanup
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[HeroScene] init failed', err)
    // return safe no-op
    return () => {}
  }
}

// Backward-compatible destroy helper that accepts a cleanup function or calls nothing.
export function destroyHeroScene(cleanupFn) {
  if (typeof cleanupFn === 'function') {
    try { cleanupFn() } catch (e) { /* ignore */ }
  }
  // nothing else to do here - instances are cleaned by their returned cleanup function
}
