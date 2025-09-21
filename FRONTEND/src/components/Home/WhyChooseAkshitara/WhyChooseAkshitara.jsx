import React from "react";
import "./WhyChooseAkshitara.scss";
import img1 from "../../../assets/img1.png";
import img2 from "../../../assets/img2.png";
import img3 from "../../../assets/img3.png";
import imgleaf from "../../../assets/leaf2.png";
const WhyChooseAkshitara = () => {
  return (
    <div className="why-choose-akshitara">
      <div className="discover-title">
        <span className="leaf-icon">{/* Leaf SVG */}</span>
        <span className="discover-heading">Why choose Akshitara?</span>
      </div>
      <div className="why-choose-sections">
        {/* Ancient Wisdom Section */}
        <div className="why-choose-section">
          <div className="section-content" >
            <div className="section-text">
              <div className="section-title">
                <span className="leaf-icon">
                  <img src={imgleaf} alt="leaf" className="leaf" />
                </span>
                <h3>Ancient Wisdom</h3>
              </div>
              <p className="section-description">
                Rooted in 5,000-year-old Ayurvedic principles and traditional
                healing practices.
              </p>
              <ul className="section-features">
                <li>
                  <span className="checkmark">✓</span>
                  Traditional Formulations
                </li>
                <li>
                  <span className="checkmark">✓</span>
                  Time-Tested Remedies
                </li>
                <li>
                  <span className="checkmark">✓</span>
                  Holistic Approach
                </li>
              </ul>
            </div>
            <div className="section-image">
              <div className="image-placeholder ancient-wisdom-img">
                <img
                  src={img1}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modern Science Section */}
        <div className="why-choose-section">
          <div className="section-content reverse">
            <div className="section-image">
              <div className="image-placeholder modern-science-img">
                {/* Ayurvedic products image placeholder */}
                <img
                  src={img2}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            </div>
            <div className="section-text">
              <div className="section-title">
                <h3>Modern Science</h3>
                <span className="leaf-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.5 1.75 3.5L17 8z"
                      fill="#CDF4CB"
                    />
                  </svg>
                </span>
              </div>
              <p className="section-description">
                Backed by contemporary research and scientific validation for
                safety and efficacy.
              </p>
              <ul className="section-features">
                <li>
                  <span className="checkmark">✓</span>
                  Lab-Tested Quality
                </li>
                <li>
                  <span className="checkmark">✓</span>
                  Scientific Research
                </li>
                <li>
                  <span className="checkmark">✓</span>
                  Safety Standards
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Personalized Care Section */}
        <div className="why-choose-section">
          <div className="section-content">
            <div className="section-text">
              <div className="section-title">
                <span className="leaf-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.5 1.75 3.5L17 8z"
                      fill="#CDF4CB"
                    />
                  </svg>
                </span>
                <h3>Personalized Care</h3>
              </div>
              <p className="section-description">
                Tailored solutions based on your unique constitution and health
                needs.
              </p>
              <ul className="section-features">
                <li>
                  <span className="checkmark">✓</span>
                  Individual Assessment
                </li>
                <li>
                  <span className="checkmark">✓</span>
                  Customized Recommendations
                </li>
                <li>
                  <span className="checkmark">✓</span>
                  Ongoing Support
                </li>
              </ul>
            </div>
            <div className="section-image">
              <div className="image-placeholder personalized-care-img">
                {/* Ayurvedic ingredients image placeholder */}
                <img
                  src={img3}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="know-more-section">
        <button className="know-more-btn" onClick={() => {
          window.location.href = "/blogs";
        }}>
          <span>Know more</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18l6-6-6-6"
              stroke="#299c3e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WhyChooseAkshitara;
