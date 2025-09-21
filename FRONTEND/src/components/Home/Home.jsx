import React, { useEffect, useContext, useState } from "react";
import "./Home.scss";
import Banner from "./Banner/Banner";
import Category from "./Category/Category";
import Products from "../Products/Products";
import { fetchDataFromApi } from "../../utils/api";
import { Context } from "../../utils/context";
import Discover from "./Discover/Discover";
import WhyChooseAkshitara from "./WhyChooseAkshitara/WhyChooseAkshitara";
import ExploreProducts from "./ExploreProducts/ExploreProducts";

const Home = () => {
  const { products, setProducts, categories, setCategories } = useContext(Context);
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
    // console.log("Categories fetched:", res);
    // alert(JSON.stringify(res));
    setCategories(res);
  };

  return (
    <div>
      <Banner />
      <Discover />
      <WhyChooseAkshitara />
      <ExploreProducts products={products} />
      <div className="main-content">
        <div className="layout">
          <Category categories={categories} />
          {/* <Products
            headingText="Popular Products"
            products={products}
            isLoading={isLoading} // Pass loading state
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
