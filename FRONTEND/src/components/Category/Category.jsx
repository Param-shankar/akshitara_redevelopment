import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Products from "../Products/Products";
import "./Category.scss";
import { useState } from "react";
import { useEffect } from "react";

const Category = () => {
    const { cname } = useParams();
    const [cat, setcat] = useState("");
    const { data } = useFetch(
        `api/products/`
    );
    // setcat(cname);
    useEffect(() => {
      setcat(cname);
    }, [cname]);
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
