import React from "react";
import { useNavigate } from "react-router-dom";
import "./Product.scss";

const Product = ({ data, id }) => {
  const navigate = useNavigate();
  return (
    <div className="product-card" onClick={() => navigate("/product/" + id)}>
      <div className="thumbnail">
        <img src={data.image} alt={data.product_name} />
      </div>
      <div className="prod-details">
        <span className="name">{data.product_name}</span>
        <span className="price">&#8377;{data.price}</span>
      </div>
    </div>
  );
};

export default Product;
