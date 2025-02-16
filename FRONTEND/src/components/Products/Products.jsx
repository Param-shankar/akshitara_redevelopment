import React, { useState, useEffect, useRef } from "react";
import "./Products.scss";
import Product from "./Product/Product";

const Products = ({ products, innerPage, headingText }) => {
  const [visibleProducts, setVisibleProducts] = useState({});
  const productRefs = useRef([]);

  useEffect(() => {
    const observerOptions = {
      root: null, // viewport
      rootMargin: "0px",
      threshold: 0.1, // 10% visibility
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const productId = entry.target.getAttribute("data-id");

          // Delay the visibility of the product by 2 seconds (2000 milliseconds)
          setTimeout(() => {
            setVisibleProducts((prev) => ({ ...prev, [productId]: true }));
            observer.unobserve(entry.target); // Stop observing once visible
          }, 1000); // Delay for 2 seconds
        }
      });
    }, observerOptions);

    productRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [products]);

  return (
    <div className="products-container">
      {!innerPage && <div className="sec-heading">{headingText}</div>}
      <div className={`products ${innerPage ? "innerPage" : ""}`}>
        {products?.map((item, index) => (
          <div
            key={item._id}
            ref={(el) => (productRefs.current[index] = el)}
            data-id={item._id}
            className="product-wrapper"
          >
            {visibleProducts[item._id] ? (
              <Product id={item._id} data={item} />
            ) : (
              <div className="skeleton-card">
                <div className="skeleton-thumbnail"></div>
                <div className="skeleton-details">
                  <div className="skeleton-text"></div>
                  <div className="skeleton-price"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
