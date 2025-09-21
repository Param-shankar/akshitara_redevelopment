import React, { useState, useEffect, useContext } from "react";
import "./ExploreProducts.scss";
import { Context } from "../../../utils/context";
// import { fetchDataFromApi } from "../../utils/api";
import { fetchDataFromApi } from "../../../utils/api";
import { useNavigate } from "react-router-dom";
const ExploreProducts = ({products}) => {
  //   const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Sharbat");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCat, setactiveCat] = useState("Sharbat");
  const { handleAddToCart } = useContext(Context);
  // const categories = ;
  const [categories, setcategories] = useState([
    { name: "Sharbat", icon: "🥤", isActive: true },
    { name: "Drink", icon: "🥃", isActive: false },
    { name: "Food", icon: "🍽️", isActive: false },
    { name: "Cosmetics", icon: "🧴", isActive: false },
  ]);

//   useEffect(() => {
//     getProducts();
//   }, []);
//  console.log(products)
  useEffect(() => {
    if (products && products.length > 0) {
      // Filter products based on selected category
      const filtered = products.filter(
        (product) =>
          product.category
            ?.toLowerCase()
            .includes(selectedCategory.toLowerCase()) ||
          product.name?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
      setFilteredProducts(filtered.slice(0, 4)); // Show only first 4 products
      setIsLoading(false);
    }
  }, [products, selectedCategory]);

//   const getProducts = async () => {
//     setIsLoading(true);
//       const res = await fetchDataFromApi("/api/products");
//       console.log(res);
//     setProducts(res);
//     setIsLoading(false);
//   };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    // Update categories array to reflect active state
    setactiveCat(categoryName);
    // categories.forEach((cat) => {
    //   cat.isActive = cat.name === categoryName;
    // });
  };

  return (
    <div className="explore-products">
      <div className="explore-header">
        <div className="header-icon">
          
        </div>
        <h2 className="explore-title">Explore Our Products</h2>
      </div>

      <div className="category-filters">
        {Array.isArray(categories) &&
          categories?.map((category, index) => (
            <div
              key={index}
              className={`category-item ${
                category.name === activeCat ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(category.name)}>
              <div className="category-icon">
                <span className="icon-emoji">{category.icon}</span>
              </div>
              <span className="category-name">{category.name}</span>
              <div className="category-arrow">
                {category.isActive ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 14l5-5 5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 10l5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
          ))}
      </div>

      <div className="products-grid">
        {isLoading
          ? // Loading skeleton
          filteredProducts.length === 0 ? (
            <div className="no-product-found">No product found</div>
          ) :
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="product-card skeleton">
                <div className="product-brand">Akshitara Sharbat</div>
                <div className="product-image-placeholder"></div>
                <div className="product-details">
                  <div className="product-name-placeholder"></div>
                  <div className="product-description-placeholder"></div>
                  <div className="product-price-placeholder"></div>
                  <div className="product-actions">
                    <div className="add-to-cart-placeholder"></div>
                    <div className="view-product-placeholder"></div>
                  </div>
                </div>
              </div>
            ))
          : filteredProducts.map((product, index) => (
              <div key={product._id || index} className={`product-card `}>
                <div className="product-brand">
                  {product.category || " Akshitara Sharbat"}
                </div>
                <div className="product-image">
                  <img
                    src={
                      product.image ||
                      product.images?.[0] ||
                      "/api/placeholder/300/300"
                    }
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = "/api/placeholder/300/300";
                    }}
                  />
                </div>
                <div className="product-details">
                  <h3 className="product-name">
                    {product.product_name || "Product Name"}
                  </h3>
                  <p className="product-description">
                    {product.desc ||
                      "Product description goes here for health benefits and usage."}
                  </p>
                  <div className="product-price">₹{product.price || "400"}</div>
                  <div className="product-actions">
                    <button
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product, 1)}>
                      Add to Cart
                    </button>
                    <a
                      href={`/product/${product._id}`}
                      className="view-product-link">
                      View Product
                    </a>
                  </div>
                </div>
              </div>
            ))}
      </div>

      <div className="view-all-section">
        <button className="view-all-btn" onClick={() => navigate("/category/")}>
          View all products
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

export default ExploreProducts;
