// frontend/src/lib/three/HexagonTrailScene.js
import * as THREE from 'three'

/* --------- Config defaults --------- */
const DEFAULTS = {
  maxBursts: 256,      // bursts in circular buffer (each burst = 6 points)
  vertsPerBurst: 6,
  lifetime: 1.2,       // seconds
  size: 10,            // point size in px
  palette: [           // hue offsets (0..1)
    0.53,  // cyan
    0.79,  // violet
    0.92,  // magenta
    0.27   // lime
  ],
  spawnThrottleMs: 30, // minimum ms between automatic spawns
}

/* clamp device pixel ratio to avoid huge render targets on high-DPR devices */
const clampDPR = (dpr) => Math.min(Math.max(1, dpr || 1), 2)

/* default export: initializer returning cleanup() */
export default function initHexagonTrail(container, opts = {}) {
  if (!container) return () => {}

  const cfg = { ...DEFAULTS, ...opts }
  const MAX_BURSTS = cfg.maxBursts
  const VERTS_PER_BURST = cfg.vertsPerBurst
  const MAX_PARTICLES = MAX_BURSTS * VERTS_PER_BURST
  const LIFETIME = cfg.lifetime
  const SIZE = cfg.size
  const palette = Array.isArray(cfg.palette) ? cfg.palette.slice(0, 8) : DEFAULTS.palette.slice(0, 8)
  const SPAWN_THROTTLE = Math.max(0, Number(cfg.spawnThrottleMs) || DEFAULTS.spawnThrottleMs)

  // Respect prefers-reduced-motion: provide tiny static fallback
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion) {
    const dot = document.createElement('div')
    dot.style.position = 'absolute'
    dot.style.left = '50%'
    dot.style.top = '50%'
    dot.style.width = '6px'
    dot.style.height = '6px'
    dot.style.margin = '-3px 0 0 -3px'
    dot.style.borderRadius = '50%'
    dot.style.background = 'rgba(0,255,240,0.18)'
    container.appendChild(dot)
    return () => { try { dot.remove() } catch (e) {} }
  }

  /* ---- Per-instance state ---- */
  const state = {
    renderer: null,
    scene: null,
    camera: null,
    material: null,
    geometry: null,
    points: null,
    clock: null,
    frameId: null,
    resizeObserver: null,
    lastSpawn: 0,
    burstIndex: 0,
    listeners: []
  }

  try {
    const w0 = Math.max(1, container.clientWidth || 800)
    const h0 = Math.max(1, container.clientHeight || 600)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(clampDPR(window.devicePixelRatio))
    renderer.setSize(w0, h0, false)
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.inset = '0'
    renderer.domElement.style.pointerEvents = 'auto' // allow pointer events to pass through (we attach to dom for interaction if needed)
    container.appendChild(renderer.domElement)
    state.renderer = renderer

    // Scene + camera
    const scene = new THREE.Scene()
    state.scene = scene
    const camera = new THREE.PerspectiveCamera(45, w0 / h0, 0.1, 1000)
    camera.position.set(0, 0, 100)
    camera.lookAt(0, 0, 0)
    state.camera = camera

    // Buffer geometry and attributes
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(MAX_PARTICLES * 3)
    const aStart = new Float32Array(MAX_PARTICLES)
    const aLife = new Float32Array(MAX_PARTICLES)
    const aHue = new Float32Array(MAX_PARTICLES)
    const aVel = new Float32Array(MAX_PARTICLES * 3)

    // initialize attributes
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const off = i * 3
      positions[off] = positions[off + 1] = positions[off + 2] = 1e9 // off-screen sentinel
      aStart[i] = -9999
      aLife[i] = LIFETIME
      aHue[i] = Math.random()
      aVel[off] = aVel[off + 1] = aVel[off + 2] = 0
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage))
    geometry.setAttribute('aStart', new THREE.BufferAttribute(aStart, 1).setUsage(THREE.DynamicDrawUsage))
    geometry.setAttribute('aLife', new THREE.BufferAttribute(aLife, 1).setUsage(THREE.DynamicDrawUsage))
    geometry.setAttribute('aHue', new THREE.BufferAttribute(aHue, 1).setUsage(THREE.DynamicDrawUsage))
    geometry.setAttribute('aVel', new THREE.BufferAttribute(aVel, 3).setUsage(THREE.DynamicDrawUsage))
    state.geometry = geometry

    // Shader material (keep your shader logic)
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0.0 },
        uPointSize: { value: SIZE },
        uDevicePixelRatio: { value: renderer.getPixelRatio() },
        uPalette: { value: new Float32Array((palette.concat([0,0,0,0,0,0,0,0])).slice(0,8)) } // pad to 8
      },
      vertexShader: `
        attribute float aStart;
        attribute float aLife;
        attribute float aHue;
        attribute vec3 aVel;
        uniform float uTime;
        uniform float uPointSize;
        uniform float uDevicePixelRatio;
        varying float vLifeT;
        varying float vHue;
        void main(){
          float t = (uTime - aStart);
          float lifeT = clamp(t / aLife, 0.0, 1.0);
          vLifeT = 1.0 - lifeT;
          vHue = aHue;
          vec3 pos = position + aVel * t;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          float size = uPointSize * (1.0 / -mvPosition.z) * uDevicePixelRatio;
          gl_PointSize = clamp(size, 1.0, 160.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform float uTime;
        uniform float uPalette[8];
        varying float vLifeT;
        varying float vHue;

        vec3 hue2rgb(float h){
          float r = abs(h*6.0 - 3.0) - 1.0;
          float g = 2.0 - abs(h*6.0 - 2.0);
          float b = 2.0 - abs(h*6.0 - 4.0);
          return clamp(vec3(r,g,b), 0.0, 1.0);
        }

        void main(){
          vec2 uv = gl_PointCoord - 0.5;
          float dist = length(uv) * 2.0;
          float alpha = smoothstep(1.0, 0.0, dist);

          float t = fract(vHue + uTime * 0.08);
          vec3 c0 = hue2rgb(uPalette[0]);
          vec3 c1 = hue2rgb(uPalette[1]);
          vec3 c2 = hue2rgb(uPalette[2]);
          vec3 c3 = hue2rgb(uPalette[3]);
          vec3 paletteColor;
          if (t < 0.33) {
            float p = t / 0.33;
            paletteColor = mix(c0, c1, p);
          } else if (t < 0.66) {
            float p = (t - 0.33) / 0.33;
            paletteColor = mix(c1, c2, p);
          } else {
            float p = (t - 0.66) / 0.34;
            paletteColor = mix(c2, c3, p);
          }

          float lifeMul = vLifeT;
          float outA = alpha * lifeMul;
          float inner = smoothstep(0.0, 0.35, 1.0 - dist);
          vec3 color = paletteColor * (0.6 + 0.8 * inner) * (0.6 + 0.4 * lifeMul);
          gl_FragColor = vec4(color, outA);
        }
      `
    })
    state.material = material

    const points = new THREE.Points(geometry, material)
    scene.add(points)
    state.points = points

    // Clock + state
    const clock = new THREE.Clock()
    state.clock = clock
    let tNow = 0

    // helper: convert screen to world position at z=0 plane
    const screenToWorld = (clientX, clientY) => {
      const rect = renderer.domElement.getBoundingClientRect()
      const x = ((clientX - rect.left) / (rect.width || 1)) * 2 - 1
      const y = -((clientY - rect.top) / (rect.height || 1)) * 2 + 1
      const vec = new THREE.Vector3(x, y, 0.5).unproject(camera)
      const dir = vec.sub(camera.position).normalize()
      const distance = -camera.position.z / (dir.z || 1)
      const pos = camera.position.clone().add(dir.multiplyScalar(distance))
      return pos
    }

    // spawn a hex burst at client coords
    function spawnHexBurst(clientX, clientY, speed = 30, baseHue = Math.random()) {
      const world = screenToWorld(clientX, clientY)
      const cx = world.x, cy = world.y, cz = world.z
      const angleOffset = Math.random() * Math.PI * 2

      const posAttr = geometry.attributes.position.array
      const velAttr = geometry.attributes.aVel.array
      const aStartArr = geometry.attributes.aStart.array
      const aLifeArr = geometry.attributes.aLife.array
      const aHueArr = geometry.attributes.aHue.array

      for (let v = 0; v < VERTS_PER_BURST; v++) {
        const idx = (state.burstIndex * VERTS_PER_BURST + v) % MAX_PARTICLES
        const base = idx * 3
        const a = angleOffset + v * Math.PI * 2 / VERTS_PER_BURST
        const dirx = Math.cos(a)
        const diry = Math.sin(a)
        const jitterR = 0.6 + Math.random() * 0.8
        posAttr[base] = cx + dirx * (0.6 * jitterR)
        posAttr[base + 1] = cy + diry * (0.6 * jitterR)
        posAttr[base + 2] = cz + (Math.random() - 0.5) * 0.1

        const speedJ = speed * (0.8 + Math.random() * 0.6)
        velAttr[base] = dirx * speedJ * (0.8 + Math.random() * 0.4)
        velAttr[base + 1] = diry * speedJ * (0.8 + Math.random() * 0.4)
        velAttr[base + 2] = (Math.random() - 0.5) * 6.0

        aStartArr[idx] = tNow
        aLifeArr[idx] = LIFETIME * (0.8 + Math.random() * 0.6)
        aHueArr[idx] = baseHue + (v / VERTS_PER_BURST) * 0.05
      }

      geometry.attributes.position.needsUpdate = true
      geometry.attributes.aVel.needsUpdate = true
      geometry.attributes.aStart.needsUpdate = true
      geometry.attributes.aLife.needsUpdate = true
      geometry.attributes.aHue.needsUpdate = true

      state.burstIndex = (state.burstIndex + 1) % MAX_BURSTS
    }

    /* ---- Event handlers ---- */
    const pointer = { x: -9999, y: -9999 }
    const onPointerMove = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      const nowMs = performance.now()
      if (nowMs - state.lastSpawn > SPAWN_THROTTLE) {
        spawnHexBurst(e.clientX, e.clientY, 26 + Math.random() * 36, Math.random())
        state.lastSpawn = nowMs
      }
    }
    const onPointerDown = (e) => {
      spawnHexBurst(e.clientX, e.clientY, 80 + Math.random() * 80, Math.random())
    }
    const onPointerLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
    }

    renderer.domElement.addEventListener('pointermove', onPointerMove, { passive: true })
    renderer.domElement.addEventListener('pointerdown', onPointerDown, { passive: true })
    renderer.domElement.addEventListener('pointerleave', onPointerLeave, { passive: true })
    state.listeners.push({ target: renderer.domElement, type: 'pointermove', fn: onPointerMove })
    state.listeners.push({ target: renderer.domElement, type: 'pointerdown', fn: onPointerDown })
    state.listeners.push({ target: renderer.domElement, type: 'pointerleave', fn: onPointerLeave })

    /* ---- Resize handling ---- */
    const handleResize = () => {
      const w = Math.max(1, container.clientWidth || 800)
      const h = Math.max(1, container.clientHeight || 600)
      const dpr = clampDPR(window.devicePixelRatio)
      renderer.setPixelRatio(dpr)
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      if (material && material.uniforms) material.uniforms.uDevicePixelRatio.value = renderer.getPixelRatio()
    }

    if (typeof ResizeObserver !== 'undefined') {
      state.resizeObserver = new ResizeObserver(() => setTimeout(handleResize, 60))
      state.resizeObserver.observe(container)
    } else {
      const onWinResize = () => setTimeout(handleResize, 60)
      window.addEventListener('resize', onWinResize, { passive: true })
      state.listeners.push({ target: window, type: 'resize', fn: onWinResize })
    }

    handleResize()

    /* ---- Animation loop ---- */
    let frameId = null
    const animate = () => {
      tNow = clock.getElapsedTime()
      if (material && material.uniforms) material.uniforms.uTime.value = tNow

      // occasional scavenging of very old particles (keeps buffer tidy)
      if (Math.floor(tNow * 60) % 30 === 0) {
        const posArr = geometry.attributes.position.array
        const startArr = geometry.attributes.aStart.array
        const lifeArr = geometry.attributes.aLife.array
        let changed = false
        for (let i = 0; i < MAX_PARTICLES; i++) {
          const st = startArr[i]
          const li = lifeArr[i]
          if (st > -1000 && (tNow - st) > li + 0.4) {
            const off = i * 3
            if (posArr[off] !== 1e9) {
              posArr[off] = posArr[off + 1] = posArr[off + 2] = 1e9
              changed = true
            }
          }
        }
        if (changed) geometry.attributes.position.needsUpdate = true
      }

      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
      state.frameId = frameId
    }

    frameId = requestAnimationFrame(animate)
    state.frameId = frameId

    /* ---- Cleanup function (returned) ---- */
    const cleanup = () => {
      try {
        if (state.frameId) {
          cancelAnimationFrame(state.frameId)
          state.frameId = null
        }
        // remove event listeners
        try {
          renderer.domElement.removeEventListener('pointermove', onPointerMove)
          renderer.domElement.removeEventListener('pointerdown', onPointerDown)
          renderer.domElement.removeEventListener('pointerleave', onPointerLeave)
        } catch (e) {}
        try { window.removeEventListener('resize', handleResize) } catch (e) {}

        if (state.resizeObserver) {
          try { state.resizeObserver.disconnect() } catch (e) {}
          state.resizeObserver = null
        }

        // dispose geometry/material
        try { geometry.dispose() } catch (e) {}
        try { material.dispose() } catch (e) {}
        // remove canvas from DOM and dispose renderer
        try {
          if (renderer.domElement && renderer.domElement.parentElement) {
            renderer.domElement.parentElement.removeChild(renderer.domElement)
          }
        } catch (e) {}
        try { renderer.forceContextLoss?.() } catch (e) {}
        try { renderer.dispose?.() } catch (e) {}
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[HexagonTrail] cleanup exception', err)
      }
    }

    // store for external access if needed
    state.material = material
    // return cleanup so caller can call it
    return cleanup
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[HexagonTrail] init failed', err)
    return () => {}
  }
}

/* Backwards-compatible destroy helper */
export function destroyHexagonTrail(cleanupFn) {
  if (typeof cleanupFn === 'function') {
    try { cleanupFn() } catch (e) { /* ignore */ }
  }
}
