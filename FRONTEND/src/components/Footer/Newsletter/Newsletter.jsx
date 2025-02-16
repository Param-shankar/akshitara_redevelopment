import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import "./Newsletter.scss";

const SocialMedia = () => {
  return (
    <div className="newsletter-section">
      <div className="newsletter-content">
        <span className="big-text">
          Follow us on social media for the latest updates!
        </span>
        <span className="text">
          Stay connected with us through our social media channels and be the
          first to know about special offers, new products, and Ayurvedic health
          tips.
        </span>
        <span className="social-icons">
          <div className="icon">
            <FaLinkedinIn size={14} />
          </div>
          <div className="icon">
            <FaFacebookF size={14} />
          </div>
          <div className="icon">
            <FaTwitter size={14} />
          </div>
          <div className="icon">
            <FaInstagram size={14} />
          </div>
        </span>
      </div>
    </div>
  );
};

export default SocialMedia;
