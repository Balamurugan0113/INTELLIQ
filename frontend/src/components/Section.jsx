import React from "react";
import "./Section.css";
import { FaInfoCircle, FaEye, FaCalendarAlt, FaTrophy, FaHandshake, FaEnvelope, FaStar } from "react-icons/fa";

const getSectionIcon = (id) => {
  switch (id) {
    case "about":
      return <FaInfoCircle className="ootb-icon" />;
    case "vision":
      return <FaEye className="ootb-icon" />;
    case "events":
      return <FaCalendarAlt className="ootb-icon" />;
    case "achievements":
      return <FaTrophy className="ootb-icon" />;
    case "collaborators":
      return <FaHandshake className="ootb-icon" />;
    case "contact":
      return <FaEnvelope className="ootb-icon" />;
    default:
      return <FaStar className="ootb-icon" />;
  }
};

export default function Section({ id, title, variant, children }) {
  if (variant === "plain") {
    return (
      <section id={id} className="section section--plain" aria-label={title || id}>
        {title && (
          <div className="container">
            <div className="section-title-wrapper">
              <div className="out-of-the-box-heading">
                {getSectionIcon(id)}
                <h2 id={`${id}-title`} className="section-title neon-heading">
                  {title}
                </h2>
              </div>
            </div>
          </div>
        )}
        <div className="panel-plain">{children}</div>
      </section>
    );
  }

  return (
    <section
      id={id}
      className={`section ${variant === "compact" ? "section--compact" : ""}`}
      aria-labelledby={title ? `${id}-title` : undefined}
    >
      <div className="container">
        {title && (
          <div className="section-title-wrapper">
            <div className="out-of-the-box-heading">
              {getSectionIcon(id)}
              <h2 id={`${id}-title`} className="section-title neon-heading">
                {title}
              </h2>
            </div>
          </div>
        )}
        <div className="panel">{children}</div>
      </div>
    </section>
  );
}
