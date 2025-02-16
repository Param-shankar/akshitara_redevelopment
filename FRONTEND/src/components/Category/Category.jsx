import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Products from "../Products/Products";
import "./Category.scss";
const Category = () => {
    const { cname } = useParams();
    const { data } = useFetch(
        `/api/products/category/${cname}`
    );
    return (
        <div className="category-main-content">
            <div className="layout">
                <div className="category-title">
                    {cname}
                </div>
                <Products innerPage={true} products={data} />
            </div>
        </div>
    );
};

export default Category;
