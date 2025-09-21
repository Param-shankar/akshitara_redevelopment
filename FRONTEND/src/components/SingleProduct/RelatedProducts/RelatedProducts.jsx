import React from "react";
import useFetch from "../../../hooks/useFetch";
import Products from "../../Products/Products";

const RelatedProducts = ({ categoryName, productId }) => {
  const { data } = useFetch(
    `/api/products/related/${productId}/${categoryName}`
  );

  return (
    <div className="related-products">
      <Products headingText="Related Products" products={data} cat={""} setcat={()=> {}}/>
    </div>
  );
};

export default RelatedProducts;
