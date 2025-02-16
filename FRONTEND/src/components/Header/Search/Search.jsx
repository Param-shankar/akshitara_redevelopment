import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import "./Search.scss";
import useFetch from "../../../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const Search = ({ setSearchModal }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => {
    setQuery(e.target.value);
  };

  let { data } = useFetch(query ? `/api/products/query/${query}` : null);

  // Ensure data is always an array, or set it to an empty array if not
  if (!Array.isArray(data)) {
    data = [];
  }

  return (
    <div className="search-modal">
      <div className="form-field">
        <input
          autoFocus
          type="text"
          placeholder="Search for products"
          value={query}
          onChange={onChange}
        />
        <MdClose className="close-btn" onClick={() => setSearchModal(false)} />
      </div>
      <div className="search-result-content">
        {!query.length ? (
          <div className="start-msg">
            Start typing to see products you are looking for.
          </div>
        ) : !data.length ? (
          <div className="start-msg">
            No products found matching your search.
          </div>
        ) : (
          <div className="search-results">
            {data.map((item) => (
              <div
                className="search-result-item"
                key={item._id}
                onClick={() => {
                  navigate("/product/" + item._id);
                  setSearchModal(false);
                }}
              >
                <div className="image-container">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="prod-details">
                  <span className="name">{item.product_name}</span>
                  <span className="desc">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
