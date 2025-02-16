import React, { useEffect, useContext, useState } from "react";
import "./Home.scss";
import Banner from "./Banner/Banner";
import Category from "./Category/Category";
import Products from "../Products/Products";
import { fetchDataFromApi } from "../../utils/api";
import { Context } from "../../utils/context";

const Home = () => {
  const { products, setProducts, categories, setCategories } =
    useContext(Context);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  const getProducts = async () => {
    setIsLoading(true); // Start loading
    const res = await fetchDataFromApi("/api/products");
    setProducts(res);
    setIsLoading(false); // End loading
  };

  const getCategories = async () => {
    const res = await fetchDataFromApi("/api/category");
    setCategories(res);
  };

  return (
    <div>
      <Banner />
      <div className="main-content">
        <div className="layout">
          <Category categories={categories} />
          <Products
            headingText="Popular Products"
            products={products}
            isLoading={isLoading} // Pass loading state
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
