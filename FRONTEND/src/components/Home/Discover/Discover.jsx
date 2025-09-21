import React from "react";
import "./Discover.scss";
import { FaArrowRight } from "react-icons/fa";
function Discover() {
  return (
    <div className="discover">
      <div className="discover-title">
        <span className="leaf-icon">{/* Leaf SVG */}</span>
        <span className="discover-heading">What you’ll Discover</span>
      </div>
      <div className="discover-steps">
        <div className="discover-step">
          <div className="discover-icon">
            {/* User icon */}
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#CDF4CB" />
              <rect x="7" y="8" width="10" height="6" rx="2" fill="#5CB85C" />
              <rect x="9" y="15" width="6" height="2" rx="1" fill="#5CB85C" />
            </svg>
          </div>
          <div className="discover-step-title">Personalized Analysis</div>
          <div className="discover-step-desc">
            Advanced assessment based
            <br />
            on traditional Ayurvedic
            <br />
            principles
          </div>
        </div>
        <div className="discover-arrow">
          {/* <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 12h8m0 0l-4-4m4 4l-4 4"
              stroke="#5CB85C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg> */}
          <FaArrowRight color="#299c3e" size={2} />
        </div>
        <div className="discover-step">
          <div className="discover-icon">
            {/* Clipboard icon */}
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#CDF4CB" />
              <rect x="8" y="7" width="8" height="10" rx="2" fill="#5CB85C" />
              <rect x="10" y="10" width="4" height="2" rx="1" fill="#fff" />
              <rect x="10" y="13" width="4" height="2" rx="1" fill="#fff" />
              <circle cx="16" cy="11" r="2" fill="#fff" />
              <path
                d="M15.5 11.5l1-1"
                stroke="#5CB85C"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="discover-step-title">Instant result</div>
          <div className="discover-step-desc">
            Get your constitutional type
            <br />
            (Prakriti) and imbalances
            <br />
            (Vikriti)
          </div>
        </div>
        <div className="discover-arrow">
          {/* <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 12h8m0 0l-4-4m4 4l-4 4"
              stroke="#5CB85C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg> */}
          <FaArrowRight color="#299c3e" size={2} />
        </div>
        <div className="discover-step">
          <div className="discover-icon">
            {/* Puzzle hand icon */}
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#CDF4CB" />
              <path
                d="M16 14v-2a2 2 0 0 0-2-2h-2v-2a2 2 0 0 1 2-2h2"
                stroke="#5CB85C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 16h8v-2a2 2 0 0 0-2-2h-2v-2a2 2 0 0 1 2-2h2"
                stroke="#5CB85C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 16v-2a2 2 0 0 1 2-2h2v-2a2 2 0 0 0-2-2H8"
                stroke="#5CB85C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="discover-step-title">Tailored Solutions</div>
          <div className="discover-step-desc">
            Receive customized product
            <br />
            and lifestyle
            <br />
            recommendations
          </div>
        </div>
      </div>
    </div>
  );
}

export default Discover;
