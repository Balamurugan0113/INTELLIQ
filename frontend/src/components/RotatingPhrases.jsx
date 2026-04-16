// frontend/src/components/RotatingPhrases.jsx
import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

/**
 * RotatingPhrases
 * - phrases: array of strings
 * - interval: ms between phrase changes (default 3000)
 * - duration: transition duration in ms (default 360)
 *
 * This component renders each phrase inside a <span>, sets an "is-active" class
 * on the currently visible phrase, and cycles automatically. It uses aria-live
 * for screen-readers.
 */
export default function RotatingPhrases({ phrases = [], interval = 3000, duration = 360, className = "" }) {
  const [index, setIndex] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const timer = setInterval(() => {
      setIndex(i => {
        const next = (i + 1) % phrases.length;
        return next;
      });
    }, Math.max(800, interval)); // enforce minimum interval

    return () => {
      mounted.current = false;
      clearInterval(timer);
    };
  }, [phrases.length, interval]);

  // expose CSS duration value to the DOM for fine-tuning if needed
  const style = { ["--rp-duration-ms"]: `${duration}ms` };

  return (
    <div className={`rotating-container ${className || ""}`} style={style} aria-live="polite" aria-atomic="true">
      {phrases.map((p, i) => (
        <span
          key={i}
          className={`rotating-phrase ${i === index ? "is-active" : ""}`}
          aria-hidden={i === index ? "false" : "true"}
        >
          {p}
        </span>
      ))}
    </div>
  );
}

RotatingPhrases.propTypes = {
  phrases: PropTypes.arrayOf(PropTypes.string).isRequired,
  interval: PropTypes.number,
  duration: PropTypes.number,
  className: PropTypes.string
};
