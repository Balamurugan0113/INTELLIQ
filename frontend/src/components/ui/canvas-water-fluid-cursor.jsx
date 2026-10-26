import React, { useEffect, useRef } from "react";

export default function CanvasWaterFluidCursor({
  zIndex = 9999,
  blur = 6,
  coreSize = 2,
  maxDrops = 25,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const drops = useRef([]);
  const currentColor = useRef("#00FFC8");

  const last = useRef({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
    t: performance.now(),
  });

  useEffect(() => {
    // Detect mobile or low-performance devices to prevent lag
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 || "ontouchstart" in window || navigator.maxTouchPoints > 0);

    // Skip heavy canvas loop on mobile devices for 100% smooth performance
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    const dpr = Math.min(1.5, window.devicePixelRatio || 1);

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

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

    const emit = (x, y) => {
      updateColorFromSection();

      const now = performance.now();
      const dt = Math.max(16, now - last.current.t);

      const dx = x - last.current.x;
      const dy = y - last.current.y;

      const speed = Math.sqrt(dx * dx + dy * dy) / dt;
      const slowFactor = clamp(1.1 - speed * 3.0, 0.15, 1.1);

      drops.current.push({
        x: x + (Math.random() - 0.5) * 2,
        y: y + (Math.random() - 0.5) * 2,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        life: 1,
        r: 4 + Math.random() * 6 + slowFactor * 8,
        color: currentColor.current,
      });

      if (drops.current.length > maxDrops) {
        drops.current.splice(0, drops.current.length - maxDrops);
      }

      last.current = { x, y, t: now };
    };

    const onMouseMove = (e) => emit(e.clientX, e.clientY);

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const drawMetaballs = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "lighter";

      for (let i = drops.current.length - 1; i >= 0; i--) {
        const d = drops.current[i];

        d.x += d.vx;
        d.y += d.vy;

        d.vx *= 0.96;
        d.vy *= 0.96;

        d.life *= 0.94;
        d.r *= 0.98;

        const a = clamp(d.life, 0, 1);

        const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
        grad.addColorStop(0, hexToRgba(d.color, 0.25 * a));
        grad.addColorStop(0.7, hexToRgba(d.color, 0.08 * a));
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();

        if (d.life < 0.05 || d.r < 1) {
          drops.current.splice(i, 1);
        }
      }

      ctx.globalCompositeOperation = "source-over";

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
        opacity: 0.9,
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
