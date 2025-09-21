import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Products from "../Products/Products";
import "./Category.scss";
import { useState } from "react";

const Category = () => {
    const { cname } = useParams();
    console.log("the cname is ", cname);

    const [cat, setcat] = useState("");
    console.log("the cat is ",cat);
    const { data } = useFetch(
      cname ? `/api/products/category/${cname}` : `api/products/`
    );
    console.log("the ", data);
    return (
        <div className="category-main-content">
            <div className="layout">
                {/* <div className="category-title">
                    {cname ? cname : "Products"}
                </div> */}
                <Products innerPage={true} products={data} cat={cat} setcat={setcat} />
            </div>
        </div>
    );
};

export default Category;
