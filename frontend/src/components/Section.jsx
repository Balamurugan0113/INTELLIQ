import React from "react";
import "./Section.css";

export default function Section({ id, title, variant, children }) {
  return (
    <section
      id={id}
      className={`section ${variant === "compact" ? "section--compact" : ""}`}
      aria-labelledby={title ? `${id}-title` : undefined}
    >
      <div className="container">
        {title && (
          <h2 id={`${id}-title`} className="section-title">
            {title}
          </h2>
        )}
        <div className="panel">{children}</div>
      </div>
    </section>
  );
}
