import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Products.scss";
import Product from "./Product/Product";
import { fetchDataFromApi } from "../../utils/api";

const Products = ({ products, innerPage, headingText, cat, setcat , releted}) => {
  const navigate = useNavigate();
  const { cname } = useParams();

  console.log("the cname in products is ", cname);
  // Intersection observer for skeleton reveal
  const [visibleProducts, setVisibleProducts] = useState({});
  const productRefs = useRef([]);

  // Sidebar filters and sorting
  const getCategories = async () => {
    const res = await fetchDataFromApi("/api/category");
    console.log("Categories fetched:", res);
    // alert(JSON.stringify(res));
    const names = res.map((item) => item.title);
  
    setCategories(names);
  };
  // const CATEGORY_OPTIONS = ["Drinks", "Sharbats", "Functional Foods"];
  const [CATEGORY_OPTIONS, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [sortBy, setSortBy] = useState("relevance");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  useEffect(() => {
    getCategories();
  }, []);
  // Preselect category from route param if present 
  useEffect(() => {
    if (cname) {
      const normalized = cname.toLowerCase();
      const match = CATEGORY_OPTIONS.find(
        (c) => c.toLowerCase() === normalized
      );
      if (match) {
        setSelectedCategories(new Set([match]));
      }
    }

    if (cat) {
      const normalized = cat.toLowerCase();
      const match = CATEGORY_OPTIONS.find(
        (c) => c.toLowerCase() === normalized
      );
      if (match) {
        setSelectedCategories(new Set([match]));
      }
    }
  }, [cname, cat]);

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

  // Derived, filtered + sorted list
  const filteredSortedProducts = useMemo(() => {
    let list = Array.isArray(products) ? [...products] : [];

    if (selectedCategories.size > 0) {
      const selectedLower = new Set(
        Array.from(selectedCategories).map((c) => c.toLowerCase())
      );
      list = list.filter((p) => {
        const categoryValue =
          p.category || p.product_category || p.categoryName || "";
        const nameValue = p.product_name || p.name || "";
        const text = `${categoryValue} ${nameValue}`.toLowerCase();
        for (const sc of selectedLower) {
          if (text.includes(sc)) return true;
        }
        return false;
      });
    }

    if (sortBy === "price_asc") {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "newest") {
      list.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    }
    return list;
  }, [products, selectedCategories, sortBy]);

  const toggleCategory = (label) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  useEffect(() => {
    if (selectedCategories.size === 0 && Array.isArray(products)) {
      // Show all products immediately if no filter is selected
      const allVisible = {};
      products.forEach((item, idx) => {
        allVisible[item._id || idx] = true;
      });
      setVisibleProducts(allVisible);
    }
  }, [selectedCategories, products]);

  return (
    <div className="products-container">
      {!innerPage && <div className="sec-heading">{headingText}</div>}

      <div className="category-layout">
        {/* Sidebar */}
        <aside className={`sidebar ${isFilterOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <div className="sidebar-title">Products</div>
            <button
              className="close-btn"
              onClick={() => setIsFilterOpen(false)}>
              ×
            </button>
          </div>
          <div className="checkboxes">
            {CATEGORY_OPTIONS.map((label) => (
              <label
                key={label}
                className={`checkbox ${selectedCategories.has(label) ? "active" : ""
                  }`}>
                <input
                  type="checkbox"
                  checked={selectedCategories.has(label)}
                  onChange={() => {
                    toggleCategory(label);
                    setcat(label);
                  }}
                // onChange={() =>setcat(label)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <button className="quiz-btn" onClick={() => navigate("/test")}>
            Take Quiz
          </button>
        </aside> 

        {/* Content */}
        <div className="content">
          <div className="toolbar">
            <button
              className="filter-btn"
              onClick={() => setIsFilterOpen(true)}>
              Filter ▾
            </button>
            {/* <div className="sort">
              <span>Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}>
                <option value="relevance">Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div> */}
          </div>
          <div className={`products ${innerPage ? "innerPage" : ""}`}>
            {filteredSortedProducts?.map((item, index) => (
              <div
                key={item._id || index}
                ref={(el) => (productRefs.current[index] = el)}
                data-id={item._id || index}
                className="product-wrapper">
                {visibleProducts[item._id] || visibleProducts[index] ? (
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
      </div>
    </div>
  );
};

export default Products;
