// frontend/src/lib/three/LogoLoopScene.js
import * as THREE from "three";

/**
 * Responsive left-to-right logo loop scene.
 * initLogoLoopScene(container, options) -> cleanup()
 *
 * Options:
 *  - images: string[] (required)
 *  - count: number (visible slots)
 *  - trackWidth: number (logical track width)
 *  - logoSize: number (base plane size)
 *  - speed: number (movement speed)
 *  - spacingFactor: number
 *  - y: vertical offset
 */
export default function initLogoLoopScene(container, options = {}) {
  if (!container) return () => {};

  const {
    images = [],
    count = Math.max(1, images.length),
    trackWidth = 14,
    logoSize = 1.5,
    speed = 0.04,
    spacingFactor = 1.5,
    y = 0,
  } = options;

  if (!images || images.length === 0) {
    console.warn("[LogoLoopScene] no images provided");
    return () => {};
  }

  // per-instance state
  const state = {
    renderer: null,
    scene: null,
    camera: null,
    group: null,
    rafId: null,
    resizeObserver: null,
    slots: [],
    textures: [],
    sprites: [],
    meshes: [],
    loader: null,
    listeners: [],
  };

  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  // create renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(DPR);
  renderer.setClearColor(0x000000, 0); // transparent
  renderer.domElement.style.pointerEvents = "none";
  renderer.domElement.style.display = "block";
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  container.appendChild(renderer.domElement);
  state.renderer = renderer;

  // scene & camera
  const scene = new THREE.Scene();
  state.scene = scene;
  const camera = new THREE.PerspectiveCamera(40, 2, 0.1, 100);
  camera.position.set(0, 0.6, 8); // tuned to look nice
  camera.lookAt(0, 0, 0);
  state.camera = camera;

  // lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.28));
  const pl = new THREE.PointLight(0x00fff0, 0.45, 50);
  pl.position.set(0, 3.6, 8);
  scene.add(pl);

  // group
  const group = new THREE.Group();
  group.position.y = y;
  group.position.x = 0;
  scene.add(group);
  state.group = group;

  // shared geometry (plane)
  const geo = new THREE.PlaneGeometry(logoSize, logoSize);

  // texture loader
  const loader = new THREE.TextureLoader();
  state.loader = loader;

  // helpers to compute visual parameters using container size
  function computeParams() {
    // logical track width in world units mapped to container aspect
    const rect = container.getBoundingClientRect();
    const w = Math.max(1, rect.width || window.innerWidth || 800);
    const h = Math.max(1, rect.height || window.innerHeight || 240);
    const aspect = w / h;

    // Determine spacing in world coordinates using trackWidth and spacingFactor
    const total = Math.max(1, count);
    const spacing = (trackWidth / total) * spacingFactor;

    return { w, h, aspect, spacing, half: trackWidth / 2 };
  }

  let params = computeParams();

  // create glow texture for sprites
  function createGlowTexture() {
    const size = 128;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.12, "rgba(0,255,240,0.85)");
    g.addColorStop(0.32, "rgba(156,107,255,0.45)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  }

  const glowTex = createGlowTexture();

  // load textures synchronously into array; onLoad will set material.map when available
  const textures = [];
  const safeTexture = (src) =>
    new Promise((resolve) => {
      loader.load(
        src,
        (tex) => {
          try {
            if ("colorSpace" in tex) tex.colorSpace = THREE.SRGBColorSpace;
          } catch (e) {}
          tex.anisotropy = renderer.capabilities?.getMaxAnisotropy?.() || 4;
          resolve(tex);
        },
        undefined,
        () => {
          // onError: create a small placeholder texture (colored)
          const c = document.createElement("canvas");
          c.width = c.height = 64;
          const ctx = c.getContext("2d");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, 64, 64);
          ctx.fillStyle = "#000";
          ctx.fillRect(8, 8, 48, 48);
          const fallback = new THREE.CanvasTexture(c);
          fallback.needsUpdate = true;
          resolve(fallback);
        }
      );
    });

  // prepare slots (meshes + sprites) AFTER textures load
  let slots = []; // will hold { mesh, sprite, x, mat }

  (async function initSlots() {
    // load textures (limit to needed)
    const needed = Math.max(1, Math.min(count, Math.max(1, images.length)));
    for (let i = 0; i < needed; i++) {
      const idx = i % images.length;
      const tex = await safeTexture(images[idx]);
      textures.push(tex);
    }

    // compute runtime params (spacing/half)
    params = computeParams();
    const spacing = params.spacing;
    const half = params.half;

    const total = Math.max(1, count);
    for (let i = 0; i < total; i++) {
      const tex = textures[i % textures.length] || null;
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geo, mat);

      // evenly spaced start positions centered around 0
      const startX = -((total - 1) * spacing) / 2 + i * spacing;
      mesh.position.set(startX, 0, computeZ(startX, half));
      mesh.scale.setScalar(computeScale(startX, half));

      // glow sprite
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTex,
          color: new THREE.Color(0x00fff0),
          transparent: true,
          opacity: 0.07,
          depthWrite: false,
        })
      );
      sprite.scale.set(logoSize * 1.6, logoSize * 1.6, 1.0);
      sprite.position.set(mesh.position.x, mesh.position.y, mesh.position.z - 0.03);

      group.add(sprite);
      group.add(mesh);

      slots.push({ mesh, sprite, x: startX, mat });
      state.meshes.push(mesh);
      state.sprites.push(sprite);
    }

    // ----- RECENTER VISUAL BAND BASED ON TEXTURE ASPECTS -----
    // Many logos have different aspect ratios; compute the visual left/right
    // edges using the actual texture image sizes (approx world width = logoSize * mesh.scale).
    (function recenterByTexture() {
      if (!slots.length) return;
      let leftMost = Infinity;
      let rightMost = -Infinity;

      for (let i = 0; i < slots.length; i++) {
        const s = slots[i];
        // attempt to read image dimensions (Texture.image may be HTMLImageElement or canvas)
        const mat = s.mesh.material;
        const tex = mat && mat.map ? mat.map : null;
        let aspect = 1;
        if (tex && tex.image) {
          const img = tex.image;
          // some textures load as Image, some as canvas; guard widths/heights
          if (img.width && img.height) aspect = img.width / img.height;
        }
        // mesh.scale.x is scalar applied to plane width; base plane width === logoSize
        // use a modest clamp to avoid extreme aspect ratios skewing layout
        const aspectFactor = Math.min(1.6, Math.max(0.6, aspect));
        const worldWidth = (s.mesh.scale.x || 1) * logoSize * aspectFactor;
        const halfW = worldWidth / 2;
        const left = s.x - halfW;
        const right = s.x + halfW;
        if (left < leftMost) leftMost = left;
        if (right > rightMost) rightMost = right;
      }

      if (!isFinite(leftMost) || !isFinite(rightMost)) return;

      const visualMid = (leftMost + rightMost) / 2;
      // shift everything so visualMid becomes 0
      for (const s of slots) {
        s.x = s.x - visualMid;
        s.mesh.position.x = s.x;
        if (s.sprite) s.sprite.position.x = s.x;
      }
      // ensure group is centered
      group.position.x = 0;
    })();

    state.slots = slots;
  })();

  // compute helpers
  function computeZ(x, halfWidth) {
    const t = 1 - Math.min(1, Math.abs(x) / halfWidth);
    return -0.5 * t;
  }
  function computeScale(x, halfWidth) {
    const t = 1 - Math.min(1, Math.abs(x) / halfWidth);
    return 0.85 + 0.35 * t;
  }
  function computeOpacity(x, halfWidth) {
    const t = 1 - Math.min(1, Math.abs(x) / halfWidth);
    return 0.6 + 0.4 * t;
  }

  // resize function (keeps camera aspect and renderer size in sync)
  function resize() {
    try {
      params = computeParams();
      const { w, h } = params;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(Math.round(w), Math.round(h), false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      // recompute spacing & reposition existing slots (if created)
      const spacing = params.spacing;
      const half = params.half;
      if (state.slots && state.slots.length) {
        const total = state.slots.length;
        for (let i = 0; i < total; i++) {
          const s = state.slots[i];
          s.x = -((total - 1) * spacing) / 2 + i * spacing;
          s.mesh.position.set(s.x, 0, computeZ(s.x, half));
          s.mesh.scale.setScalar(computeScale(s.x, half));
          s.sprite.position.set(s.x, 0, computeZ(s.x, half) - 0.03);
        }

        // After repositioning based on spacing, re-run visual-centering to account
        // for texture aspect differences so the visual center stays at x=0.
        (function recenterAfterResize() {
          if (!state.slots || state.slots.length === 0) return;
          let leftMost = Infinity;
          let rightMost = -Infinity;
          for (let i = 0; i < state.slots.length; i++) {
            const s = state.slots[i];
            const mat = s.mesh.material;
            const tex = mat && mat.map ? mat.map : null;
            let aspect = 1;
            if (tex && tex.image) {
              const img = tex.image;
              if (img.width && img.height) aspect = img.width / img.height;
            }
            const aspectFactor = Math.min(1.6, Math.max(0.6, aspect));
            const worldWidth = (s.mesh.scale.x || 1) * logoSize * aspectFactor;
            const halfW = worldWidth / 2;
            const left = s.x - halfW;
            const right = s.x + halfW;
            if (left < leftMost) leftMost = left;
            if (right > rightMost) rightMost = right;
          }
          if (!isFinite(leftMost) || !isFinite(rightMost)) return;
          const visualMid = (leftMost + rightMost) / 2;
          for (const s of state.slots) {
            s.x = s.x - visualMid;
            s.mesh.position.x = s.x;
            if (s.sprite) s.sprite.position.x = s.x;
          }
          group.position.x = 0;
        })();
      }
    } catch (e) {
      // silent
    }
  }

  // initial resize
  resize();

  // animation loop: left -> right movement with wrapping
  function animate() {
    try {
      const spacing = params.spacing;
      const half = params.half;
      if (state.slots && state.slots.length) {
        for (const s of state.slots) {
          s.x += speed;

          // wrap when beyond right edge
          if (s.x > half + spacing) {
            s.x = -half - spacing + (s.x - (half + spacing));
          }

          const z = computeZ(s.x, half);
          const scale = computeScale(s.x, half);
          const opacity = computeOpacity(s.x, half);

          s.mesh.position.set(s.x, 0, z);
          s.mesh.scale.setScalar(scale);
          if (s.mat) s.mat.opacity = opacity;

          s.sprite.position.set(s.x, 0, z - 0.03);
          s.sprite.material.opacity = 0.055 + 0.06 * (1.0 - Math.abs(s.x) / half);
        }
      }

      renderer.render(scene, camera);
    } catch (e) {
      // ignore render errors
    }
    state.rafId = requestAnimationFrame(animate);
  }

  state.rafId = requestAnimationFrame(animate);

  // resize observer (preferred)
  if (typeof ResizeObserver !== "undefined") {
    state.resizeObserver = new ResizeObserver(() => {
      // debounce small layout changes
      setTimeout(resize, 40);
    });
    state.resizeObserver.observe(container);
  } else {
    const onWinResize = () => setTimeout(resize, 60);
    window.addEventListener("resize", onWinResize, { passive: true });
    state.listeners.push({ target: window, type: "resize", fn: onWinResize });
  }

  // cleanup
  function cleanup() {
    try {
      if (state.rafId) {
        cancelAnimationFrame(state.rafId);
        state.rafId = null;
      }
      if (state.resizeObserver) {
        try {
          state.resizeObserver.disconnect();
        } catch (e) {}
        state.resizeObserver = null;
      }
      // remove window resize listeners
      (state.listeners || []).forEach(({ target, type, fn }) => {
        try {
          target.removeEventListener(type, fn);
        } catch (e) {}
      });

      // dispose meshes & sprites
      try {
        state.meshes.forEach((m) => {
          if (!m) return;
          if (m.material) {
            if (Array.isArray(m.material)) {
              m.material.forEach((mm) => {
                mm.map?.dispose?.();
                mm.dispose?.();
              });
            } else {
              m.material.map?.dispose?.();
              m.material.dispose?.();
            }
          }
          if (m.geometry) m.geometry.dispose?.();
        });
        state.sprites.forEach((s) => {
          if (s && s.material) {
            s.material.map?.dispose?.();
            s.material.dispose?.();
          }
        });
      } catch (e) {
        // ignore
      }

      // dispose glow texture
      try {
        glowTex?.dispose?.();
      } catch (e) {}

      // remove renderer DOM
      try {
        if (renderer && renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      } catch (e) {}

      try {
        renderer.forceContextLoss?.();
      } catch (e) {}

      try {
        renderer.dispose?.();
      } catch (e) {}

      // null references
      state.scene = null;
      state.camera = null;
      state.group = null;
      state.meshes = [];
      state.sprites = [];
      state.textures = [];
    } catch (err) {
      // swallow
    }
  }

  // return cleanup for caller
  return cleanup;
}
