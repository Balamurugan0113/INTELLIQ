import React, { useEffect, useRef } from "react";
import "./About.css";
import { FaRocket, FaBrain, FaUsers, FaLightbulb, FaGraduationCap, FaCalendarAlt, FaChalkboardTeacher } from "react-icons/fa";

export default function About() {
  const a = useRef(null),
    b = useRef(null),
    c = useRef(null);

  useEffect(() => {
    const elms = [a.current, b.current, c.current];
    const targets = [200, 7, 10];
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
    <section className="about-animated-wrapper">
      {/* BACKGROUND FLOATING ORBS */}
      <div className="about-orb orb-cyan"></div>
      <div className="about-orb orb-magenta"></div>

      {/* INTRO TEXT BOX */}
      <div className="about-intro-card glass-animated-panel">
        <p className="about-text">
          <strong>INTELLIQ</strong> – Intelligence Learners and Leaders in AI &amp; Data Science is the student association of the Department of Artificial Intelligence and Data Science, focused on creating an interactive platform where students can learn, explore, collaborate, and grow beyond the classroom.
        </p>

        <p className="about-text">
          With the spirit of <em>“Innovation through Unity,”</em> INTELLIQ brings together students with a shared interest in Artificial Intelligence, Data Science, emerging technologies, and hands-on innovation.
        </p>
      </div>

      {/* INTERACTIVE FEATURE CARDS WITH GLOWING ICONS */}
      <div className="about-features-grid">
        <div className="about-feature-card card-cyan">
          <div className="feature-icon-wrapper">
            <FaRocket className="feature-icon" />
          </div>
          <div className="feature-content">
            <h4>Mission</h4>
            <p>Learn by building real-world AI projects &amp; intelligent applications.</p>
          </div>
        </div>

        <div className="about-feature-card card-magenta">
          <div className="feature-icon-wrapper">
            <FaBrain className="feature-icon" />
          </div>
          <div className="feature-content">
            <h4>Focus Areas</h4>
            <p>Machine Learning, Computer Vision, NLP, Data Engineering &amp; MLOps.</p>
          </div>
        </div>

        <div className="about-feature-card card-violet">
          <div className="feature-icon-wrapper">
            <FaUsers className="feature-icon" />
          </div>
          <div className="feature-content">
            <h4>Culture</h4>
            <p>Open, collaborative, student-centric, and mentor-driven environment.</p>
          </div>
        </div>

        <div className="about-feature-card card-emerald">
          <div className="feature-icon-wrapper">
            <FaLightbulb className="feature-icon" />
          </div>
          <div className="feature-content">
            <h4>Vision</h4>
            <p>Empowering the next generation of technology enthusiasts &amp; AI leaders.</p>
          </div>
        </div>
      </div>

      {/* STATS COUNTER GRID */}
      <div className="about-stats">
        <div className="stat stat-card-cyan">
          <div className="stat-icon-badge"><FaGraduationCap /></div>
          <div className="stat-number" ref={a}>0</div>
          <div className="stat-label">Active Members</div>
        </div>

        <div className="stat stat-card-magenta">
          <div className="stat-icon-badge"><FaCalendarAlt /></div>
          <div className="stat-number" ref={b}>0</div>
          <div className="stat-label">Technical Events</div>
        </div>

        <div className="stat stat-card-violet">
          <div className="stat-icon-badge"><FaChalkboardTeacher /></div>
          <div className="stat-number" ref={c}>0</div>
          <div className="stat-label">Mentors &amp; Advisors</div>
        </div>
      </div>
    </section>
  );
}
