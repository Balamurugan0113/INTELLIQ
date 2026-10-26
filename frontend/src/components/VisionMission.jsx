import React from "react";
import "./VisionMission.css";
import { FaEye, FaBullseye, FaCheckCircle } from "react-icons/fa";

export default function VisionMission() {
  return (
    <div className="vision-mission-container">
      <div className="vm-grid">
        {/* VISION CARD */}
        <div className="vm-card vision-card">
          <div className="vm-header">
            <div className="vm-icon-badge vision-badge">
              <FaEye />
            </div>
            <h2>Vision</h2>
          </div>
          <p className="vm-text">
            To achieve outstanding standards in the field of artificial intelligence and data science by imparting high quality education through latest curriculum, industry connect. problem solving and research for good of humanity
          </p>
        </div>

        {/* MISSION CARD */}
        <div className="vm-card mission-card">
          <div className="vm-header">
            <div className="vm-icon-badge mission-badge">
              <FaBullseye />
            </div>
            <h2>Mission</h2>
          </div>
          <ol className="mission-list">
            <li>
              <span className="mission-num">1</span>
              <span className="mission-text">
                To facilitate a good environment with excellent facilities and industrial interactions in the field of artificial intelligence and data science.
              </span>
            </li>
            <li>
              <span className="mission-num">2</span>
              <span className="mission-text">
                To enhance the cognitive skill of students to serve the global needs.
              </span>
            </li>
            <li>
              <span className="mission-num">3</span>
              <span className="mission-text">
                To produce ethically responsible professionals for serving the societal requirements
              </span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
