import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import "./App.scss";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Category from "./components/Category/Category";
import SingleProduct from "./components/SingleProduct/SingleProduct";
import Newsletter from "./components/Footer/Newsletter/Newsletter";
import Quiz from "./components/Quiz/Quiz";
import AppContext from "./utils/context";
import Consulting from "./components/Consulting/Consulting";
import Login from "./components/Auth/Login";
import BlogPage from "./components/BlogPage/BlogPage";
import BlogDetails from "./components/BlogDetails/BlogDetails";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RefreshHandler from "./utils/RefreshHandler";
import About from "./components/About/About";
import AdminOrders from "./components/Admin/Admin";
import Orders from "./components/Orders/Orders";
import Suggest from "./components/Suggest-Products/Suggest";
function AppContent() {
  const location = useLocation();
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const isAdmin = userInfo ? userInfo.isAdmin : false;
  const GOOGLE_OAUTH = process.env.RAZORPAY_KEY;
  // console.log(GOOGLE_OAUTH);

  // console.log(isAdmin);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  const AdminRoute = ({ element }) => {
    return isAdmin ? element : <Navigate to="/" />;
  };

  const GoogleAuthWrapper = () => (
    <GoogleOAuthProvider clientId="227594739094-oftiap3v83ldvk2ffrcqq1bsbl29ct84.apps.googleusercontent.com">
      <Login />
    </GoogleOAuthProvider>
  );

  return (
    <>
      {location.pathname !== "/login" && (
        <Header setIsAuthenticated={setisAuthenticated} />
      )}
      <RefreshHandler setisAuthenticated={setisAuthenticated} />
      <Routes>
        <Route path="/login" element={<GoogleAuthWrapper />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/category/:cname" element={<Category />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/test" element={<Quiz />} />
        <Route path="/consulting" element={<Consulting />} />
        <Route path="/about" element={<About />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route
          path="/suggest-products"
          // element={<p>Finding the best products for you...</p>}
          element={<PrivateRoute element={<Suggest />} />}
        />
        <Route
          path="/admin_panel"
          element={<AdminRoute element={<AdminOrders />} />}
        />
        <Route path="/orders" element={<PrivateRoute element={<Orders />} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      {location.pathname !== "/test" && <Newsletter />}
      {location.pathname !== "/test" && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContext>
        <AppContent />
      </AppContext>
    </BrowserRouter>
  );
}

export default App;
