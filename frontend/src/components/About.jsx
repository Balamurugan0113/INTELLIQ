import React, { useEffect, useRef } from "react";
import "./About.css";

export default function About() {
  const a = useRef(null),
    b = useRef(null),
    c = useRef(null);

  useEffect(() => {
    const elms = [a.current, b.current, c.current];
    const targets = [150, 5, 10];
    let raf;
    const start = performance.now();

    const animate = (t) => {
      const d = Math.min((t - start) / 1000, 1);
      elms.forEach((el, i) => {
        if (!el) return;
        el.textContent = Math.round(targets[i] * d) + "+";
      });
      if (d < 1) raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="about">
      <p className="about-text">
        INTELLIQ is the student-led Association of Artificial Intelligence &amp;
        Data Science. We organize hands-on workshops, research meetups,
        hackathons, speaker sessions, and community projects that push the
        boundaries of AI and DS.
      </p>

      <ul className="about-points">
        <li><strong>Mission:</strong> Learn by building.</li>
        <li><strong>Focus:</strong> ML, CV, NLP, Data Engineering, MLOps.</li>
        <li><strong>Culture:</strong> Open, collaborative, mentor-driven.</li>
      </ul>

      <div className="about-stats">
        <div className="stat">
          <div className="stat-number" ref={a}>0</div>
          <div className="stat-label">Members</div>
        </div>
        <div className="stat">
          <div className="stat-number" ref={b}>0</div>
          <div className="stat-label">Events</div>
        </div>
        <div className="stat">
          <div className="stat-number" ref={c}>0</div>
          <div className="stat-label">Mentors</div>
        </div>
      </div>
    </section>
  );
}
