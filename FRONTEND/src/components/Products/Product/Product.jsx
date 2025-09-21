import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Product.scss";
import { Context } from "../../../utils/context";

const Product = ({ data, id }) => {
  const navigate = useNavigate();
  const { handleAddToCart } = useContext(Context);

  const safeImage =
    data?.image || data?.images?.[0] || "/api/placeholder/300/300";
  const name = data?.product_name || data?.name || "Product";
  const desc =
    data?.desc ||
    "Product description goes here for health benefits and usage.";
  const price = data?.price || 0;
  const category = data?.category || data?.product_category || "Akshitara";

  return (
    <div className="product-card">
      {/* <div className="product-brand">{category}</div> */}
      <div className="product-image" onClick={() => navigate("/product/" + id)}>
        <img
          src={safeImage}
          alt={name}
          onError={(e) => {
            e.currentTarget.src = "/api/placeholder/300/300";
          }}
        />
      </div>
      <div className="product-details">
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{desc}</p>
        <div className="product-price">₹{price}</div>
        <div className="product-actions">
          <button
            className="add-to-cart-btn"
            onClick={() => handleAddToCart(data, 1)}>
            Add to Cart
          </button>
          <button
            className="view-product-link"
            onClick={() => navigate("/product/" + id)}>
            View Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
