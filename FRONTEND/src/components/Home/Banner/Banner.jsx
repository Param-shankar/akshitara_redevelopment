import React from "react";
import "./Banner.scss";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  // const navigate = useNavigate();
  const navigate = useNavigate();
  return (
    <div className="hero-banner">
      <div className="content">
        <div className="text-content">
          <h1>
            <span className="green">Personalized Ayurveda,</span>
            <br />
            Just for You.
          </h1>
          <p>
            Take a quick quiz and get tailored Ayurvedic product
            recommendations.
          </p>
          <div className="ctas">
            <div
              className="banner-cta v2"
              onClick={() => (window.location.href = "/test")}>
              Take Quiz <span className="arrow">➔</span>
            </div>
            <div
              className="banner-cta v2"
              onClick={() => navigate("/category/")}>
              Shop Now <span className="arrow">➔</span>
            </div>
          </div>
        </div>
        <img
          className="banner-img"
          src="https://res.cloudinary.com/dkvtnjc2f/image/upload/f_auto,q_auto/v1731420246/banner-img1_re4zjf.webp"
          alt="Ayurveda Banner"
        />

        {/* Decorative leaves */}
        <img
          src="https://pngimg.com/d/mint_PNG18.png"
          alt="leaf"
          className="leaf leaf1"
        />
        <img
          src="https://pngimg.com/d/mint_PNG18.png"
          alt="leaf"
          className="leaf leaf2"
        />
        <img
          src="https://pngimg.com/d/mint_PNG18.png"
          alt="leaf"
          className="leaf leaf3"
        />
      </div>
      {/* Responsive SVG wave at the end of the banner background */}
      <div className="banner-wave-svg">
        <svg
          width="100%"
          height="100"
          viewBox="0 0 1440 639"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none">
          <path
            d="M1492.5 330C1400 700 1100 420 720 580C300 740 -180 600 -80 300C-20 120 260 0 720 0C1180 0 1520 140 1492.5 330Z"
            fill="#CDF4CB"
          />
        </svg>
      </div>
      <div className="discover"></div>
    </div>
  );
};

export default Banner;
