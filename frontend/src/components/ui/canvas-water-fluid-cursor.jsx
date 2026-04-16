import React, { useEffect, useRef } from "react";

export default function CanvasWaterFluidCursor({
  zIndex = 9999,
  blur = 10,
  coreSize = 2,         // small dot cursor
  maxDrops = 70,        // performance control
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const drops = useRef([]);
  const currentColor = useRef("#00FFC8");

  const last = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    t: performance.now(),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // section-based color
    const updateColorFromSection = () => {
      const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
      if (!el) return;
      const target = el.closest("[data-trail]");
      if (!target) return;
      const c = target.getAttribute("data-trail");
      if (c) currentColor.current = c;
    };

    updateColorFromSection();
    window.addEventListener("scroll", updateColorFromSection, { passive: true });

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    // emit water drops (slow move => bigger + more spread)
    const emit = (x, y) => {
      updateColorFromSection();

      const now = performance.now();
      const dt = Math.max(16, now - last.current.t);

      const dx = x - last.current.x;
      const dy = y - last.current.y;

      const speed = Math.sqrt(dx * dx + dy * dy) / dt;

      // slow movement => stronger fluid blob
      const slowFactor = clamp(1.1 - speed * 3.0, 0.15, 1.1);

      const count = Math.floor(1 + slowFactor * 2);

      for (let i = 0; i < count; i++) {
        drops.current.push({
          x: x + (Math.random() - 0.5) * 3,
          y: y + (Math.random() - 0.5) * 3,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          life: 1,
          r: 6 + Math.random() * 10 + slowFactor * 12, // radius changes with slow move
          color: currentColor.current,
        });
      }

      if (drops.current.length > maxDrops) {
        drops.current.splice(0, drops.current.length - maxDrops);
      }

      last.current = { x, y, t: now };
    };

    // mouse + touch
    const onMouseMove = (e) => emit(e.clientX, e.clientY);

    const onTouchStart = (e) => {
      const t = e.touches?.[0];
      if (!t) return;
      emit(t.clientX, t.clientY);
    };

    const onTouchMove = (e) => {
      const t = e.touches?.[0];
      if (!t) return;
      emit(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // --- metaball drawing (water merging look) ---
    const drawMetaballs = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      // clear softly (keeps liquid trail)
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, w, h);

      // metaball technique:
      // draw many blurred circles + use "source-over" blending
      // then apply "lighter" to merge like liquid
      ctx.globalCompositeOperation = "lighter";

      for (let i = drops.current.length - 1; i >= 0; i--) {
        const d = drops.current[i];

        d.x += d.vx;
        d.y += d.vy;

        d.vx *= 0.98;
        d.vy *= 0.98;

        d.life *= 0.965;
        d.r *= 0.992;

        const a = clamp(d.life, 0, 1);

        // gradient blob (metaball feel)
        const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
        grad.addColorStop(0, hexToRgba(d.color, 0.28 * a));
        grad.addColorStop(0.6, hexToRgba(d.color, 0.10 * a));
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();

        if (d.life < 0.05 || d.r < 1) {
          drops.current.splice(i, 1);
        }
      }

      // back to normal blend
      ctx.globalCompositeOperation = "source-over";

      // tiny core dot cursor (small, realistic)
      ctx.beginPath();
      ctx.fillStyle = hexToRgba(currentColor.current, 0.95);
      ctx.arc(last.current.x, last.current.y, coreSize, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      drawMetaballs();
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateColorFromSection);

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);

      cancelAnimationFrame(rafRef.current);
    };
  }, [coreSize, maxDrops]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex,
        pointerEvents: "none",
        mixBlendMode: "screen",
        opacity: 0.95,
        filter: `blur(${blur}px)`,
      }}
    />
  );
}

function hexToRgba(hex, alpha = 1) {
  if (!hex) return `rgba(0,255,200,${alpha})`;
  const h = hex.replace("#", "").trim();
  if (h.length !== 6) return `rgba(0,255,200,${alpha})`;

  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);

  return `rgba(${r},${g},${b},${alpha})`;
}
