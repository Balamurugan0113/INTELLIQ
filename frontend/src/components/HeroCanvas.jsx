// frontend/src/components/HeroCanvas.jsx
import React, { useEffect, useRef } from "react";
import { initHeroScene, destroyHeroScene } from "../lib/three/HeroScene";


export default function HeroCanvas({
  lazy = true,
  rootMargin = "200px",
}) {
  const mountRef = useRef(null);
  const cleanupRef = useRef(null);
  const initedRef = useRef(false);
  const ioRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // helper to center the canvas DOM element
    function centerCanvas(canvasEl) {
      if (!canvasEl || !mount) return;
      canvasEl.style.display = "block";
      canvasEl.style.position = "absolute";
      canvasEl.style.left = "50%";
      canvasEl.style.top = "50%";
      canvasEl.style.transform = "translate(-50%, -50%)";
      canvasEl.style.pointerEvents = "none";
      canvasEl.style.maxWidth = "120%";
      canvasEl.style.maxHeight = "120%";
      // ensure wrapper has positioning
      try {
        if (mount.style.position === "" || mount.style.position === "static") {
          mount.style.position = "absolute";
          mount.style.inset = "0";
        }
      } catch (e) {}
    }

    // toggle hero-has-canvas class on the nearest .hero
    function setHeroHasCanvas(has) {
      try {
        const hero = mount.closest?.(".hero");
        if (!hero) return;
        if (has) hero.classList.add("hero-has-canvas");
        else hero.classList.remove("hero-has-canvas");
      } catch (e) {}
    }

    // initialize scene and attach canvas cleanup
    function doInit() {
      if (initedRef.current) return;
      initedRef.current = true;

      // call initHeroScene and keep cleanup
      try {
        const cleanup = initHeroScene(mount);
        cleanupRef.current = cleanup;
      } catch (e) {
        // fallback safety: call destroyHeroScene if something returned odd
        try { destroyHeroScene(cleanupRef.current); } catch (_) {}
        cleanupRef.current = null;
      }

      // attempt to find the canvas immediately (some renderers create it sync)
      setTimeout(() => {
        const canvasEl = mount.querySelector("canvas");
        if (canvasEl) {
          centerCanvas(canvasEl);
          setHeroHasCanvas(true);
        }
      }, 60);

      // also observe for the canvas node being added later
      const mo = new MutationObserver((mutations) => {
        for (const m of mutations) {
          for (const n of m.addedNodes) {
            if (n && n.nodeType === 1) {
              const isCanvas = n.tagName === "CANVAS";
              const found = isCanvas ? n : n.querySelector?.("canvas");
              if (found) {
                // center and mark
                setTimeout(() => {
                  centerCanvas(found);
                  setHeroHasCanvas(true);
                }, 30);
                return;
              }
            }
          }
          for (const n of m.removedNodes) {
            if (n && n.nodeType === 1) {
              const wasCanvas = n.tagName === "CANVAS" || n.querySelector?.("canvas");
              if (wasCanvas) {
                // check current presence
                const still = mount.querySelector("canvas");
                if (!still) setHeroHasCanvas(false);
              }
            }
          }
        }
      });
      try { mo.observe(mount, { childList: true, subtree: true }); } catch (e) {}
      mount.__heroCanvasMO = mo;
    }

    function doCleanup() {
      initedRef.current = false;
      try {
        const mo = mount.__heroCanvasMO;
        if (mo) {
          mo.disconnect();
          mount.__heroCanvasMO = null;
        }
      } catch (e) {}
      try {
        cleanupRef.current?.();
      } catch (e) {}
      cleanupRef.current = null;
      // remove class from hero
      setHeroHasCanvas(false);
    }

    // lazy init (IntersectionObserver) or immediate
    if (lazy && "IntersectionObserver" in window) {
      ioRef.current = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              doInit();
            } else {
              // cleanup when scrolled far away to save memory/battery
              if (initedRef.current) {
                doCleanup();
              }
            }
          }
        },
        { root: null, rootMargin, threshold: 0.03 }
      );
      ioRef.current.observe(mount);
    } else {
      doInit();
    }

    // window resize -> re-center canvas if present
    const onResize = () => {
      const canvasEl = mount.querySelector("canvas");
      if (canvasEl) centerCanvas(canvasEl);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      // disconnect observer
      try { ioRef.current?.disconnect(); } catch (e) {}
      try { window.removeEventListener("resize", onResize); } catch (e) {}
      // cleanup three.js
      try {
        const mo = mount.__heroCanvasMO;
        if (mo) { mo.disconnect(); mount.__heroCanvasMO = null; }
      } catch (e) {}
      try { cleanupRef.current?.(); } catch (e) {}
      cleanupRef.current = null;
      initedRef.current = false;
      // remove hero class
      try { setHeroHasCanvas(false); } catch (e) {}
    };
  }, [lazy, rootMargin]);

  // size / positioning handled by CSS (.hero-canvas is absolute inset)
  return <div ref={mountRef} className="hero-canvas" aria-hidden="true" />;
}
