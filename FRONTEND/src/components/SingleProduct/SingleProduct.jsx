import React, { useContext, useState, useEffect, lazy, Suspense } from "react";
import { Context } from "../../utils/context";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPinterest,
  FaCartPlus,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./SingleProduct.scss";

const RelatedProducts = lazy(() => import("./RelatedProducts/RelatedProducts"));

const SingleProduct = () => {
  const quantity = 1;
  const { id } = useParams();
  const { handleAddToCart } = useContext(Context);
  const { data } = useFetch(`/api/products/${id}`);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [showRelated, setShowRelated] = useState(false);
  const navigate = useNavigate();
  const [review, setReview] = useState({ rating: 0, text: "" });
  const [errors, setErrors] = useState({ rating: "", text: "" });
  const [toast, setToast] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [data]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user-info"));
    if (userData) {
      setUserInfo(userData);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const relatedSection = document.getElementById("related-products");
      if (relatedSection) {
        const rect = relatedSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          setShowRelated(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set selectedImageIdx to 0 when data changes
  useEffect(() => {
    setSelectedImageIdx(0);
  }, [data]);

  const images =
    Array.isArray(data?.images) && data.images.length > 0
      ? data.images
      : data?.image
      ? [data.image]
      : [];

  const handlePrev = () => {
    setSelectedImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleRatingChange = (rating) => {
    setReview({ ...review, rating });
    setErrors({ ...errors, rating: "" });
  };

  const handleTextChange = (e) => {
    setReview({ ...review, text: e.target.value });
    setErrors({ ...errors, text: "" });
  };

  const validateReview = () => {
    let valid = true;
    let newErrors = { rating: "", text: "" };

    if (review.rating === 0) {
      newErrors.rating = "Please provide a star rating.";
      valid = false;
    }
    if (review.text.length < 20 || review.text.length > 200) {
      newErrors.text = "Review must be between 20-200 characters.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmitReview = async () => {
    if (userInfo == null) {
      navigate("/login");
      return;
    }
    if (validateReview()) {
      handleClick("Review submitted successfully");
      const reviewData = {
        user_id: userInfo.user_id,
        product_id: data._id,
        rating: review.rating,
        text: review.text,
      };

      const url = `${process.env.REACT_APP_STRIPE_APP_DEV_URL}/api/reviews`;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewData),
        });

        if (response.ok) {
          setReview({ rating: 0, text: "" }); // Reset the review form
        }
      } catch (error) {}
    } else {
    }
  };

  const handleClick = (data) => {
    setOpen(true);
    setToast(data);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div className="single-product-main-content">
      <div className="layout">
        <div className="single-product-page">
          <div className="left">
            {loading ? (
              <div className="skeleton skeleton-image"></div>
            ) : (
              <div className="product-images">
                {/* Swiper arrows */}
                {images.length > 1 && (
                  <button
                    className="swiper-arrow left-arrow"
                    onClick={handlePrev}>
                    <FaChevronLeft />
                  </button>
                )}
                <img
                  className="main-image"
                  src={images[selectedImageIdx]}
                  alt={data?.product_name}
                />
                {images.length > 1 && (
                  <button
                    className="swiper-arrow right-arrow"
                    onClick={handleNext}>
                    <FaChevronRight />
                  </button>
                )}
                {/* Dots for image navigation */}
                {images.length > 1 && (
                  <div className="image-dots">
                    {images.map((_, idx) => (
                      <span
                        key={idx}
                        className={`dot${
                          selectedImageIdx === idx ? " active" : ""
                        }`}
                        onClick={() => setSelectedImageIdx(idx)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="right">
            {loading ? (
              <>
                <div className="skeleton skeleton-name"></div>
                <div className="skeleton skeleton-price"></div>
                <div className="skeleton skeleton-desc"></div>
              </>
            ) : (
              <>
                <span className="name">{data?.product_name}</span>
                <span className="price">&#8377;{data?.price}</span>
                <span className="desc">{data?.desc}</span>

                <div className="cart-buttons">
                  <button
                    className="add-to-cart-button"
                    onClick={() => {
                      handleAddToCart(data, quantity);
                      handleClick("Product added to cart!");
                    }}>
                    <FaCartPlus size={20} />
                    ADD TO CART
                  </button>
                </div>

                <span className="divider" />
                <div className="info-item">
                  <span className="text-bold">
                    Category: <span>{data?.category}</span>
                  </span>
                  <span className="text-bold">
                    Share:
                    <span className="social-icons">
                      <FaFacebookF size={16} />
                      <FaTwitter size={16} />
                      <FaInstagram size={16} />
                      <FaLinkedinIn size={16} />
                      <FaPinterest size={16} />
                    </span>
                  </span>
                </div>

                {/* Review Section */}
                <div className="review-section">
                  <h3>Submit Your Review</h3>
                  <div className="rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={20}
                        color={star <= review.rating ? "#ffcc00" : "#ddd"}
                        onClick={() => handleRatingChange(star)}
                        className="star"
                      />
                    ))}
                    {errors.rating && (
                      <p className="error-message">{errors.rating}</p>
                    )}
                  </div>
                  <textarea
                    placeholder="Write your product review here..."
                    value={review.text}
                    onChange={handleTextChange}
                  />
                  {errors.text && (
                    <p className="error-message">{errors.text}</p>
                  )}
                  <button
                    className="submit-review-button"
                    onClick={() => {
                      handleSubmitReview();
                    }}>
                    Submit Review
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div id="related-products">
          {showRelated && (
            <Suspense
              fallback={
                <div className="related-products-loading">Loading...</div>
              }>
              <RelatedProducts productId={id} categoryName={data?.category} />
            </Suspense>
          )}
        </div>
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}>
          {toast}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SingleProduct;
