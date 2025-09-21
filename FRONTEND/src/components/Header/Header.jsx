import { useEffect, useState, useContext, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  TbSearch,
  TbMenu2,
  TbClipboardList,
  TbHistoryToggle,
} from "react-icons/tb";
import { IoBagOutline, IoLogOutOutline } from "react-icons/io5";
import { LuUser } from "react-icons/lu";
import "./Header.scss";
import Search from "./Search/Search";
import { Context } from "../../utils/context";
import Cart from "../Cart/Cart";
import { FiShoppingCart } from "react-icons/fi";

const Header = ({ setIsAuthenticated }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [imageSrc, setImageSrc] = useState("");

  const defaultImage =
    "https://res.cloudinary.com/dkvtnjc2f/image/upload/f_auto,q_auto/v1733156285/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail_ukurhq.png";

  const handleImageError = useCallback(() => {
    setImageSrc(defaultImage);
  }, [defaultImage]);

  const { cartCount, showCart, setShowCart } = useContext(Context);
  const navigate = useNavigate();

  // Create a ref for the user dropdown
  const dropdownRef = useRef(null);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > -1);
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user-info"));
    if (userData) {
      setUserInfo(userData);
      setImageSrc(userData.image || defaultImage);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, defaultImage]);

  const handleMenuClick = () => setMenuOpen((prev) => !prev);

  const handleOrdersClick = () => {
    navigate("/orders");
  };

  const handleLogout = () => {
    localStorage.removeItem("user-info");
    setIsAuthenticated(false);
    setUserDropdownOpen(false);
    navigate("/login");
  };

  const toggleUserDropdown = () => setUserDropdownOpen((prev) => !prev);

  // Handle click outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownOpen]);

  // Helper to check if route is active
  const isActive = (path) => window.location.pathname === path;

  return (
    <>
      <header className={`main-header ${scrolled ? "sticky-header" : ""}`}>
        <div className="header-content">
          <div className="center" onClick={() => navigate("/")} style={{}}>
            AKSHITARA
          </div>
          <ul className="left">
            <li
              className={isActive("/") ? "active" : ""}
              onClick={() => navigate("/")}>
              Home
            </li>
            <li
              className={isActive("/about") ? "active" : ""}
              onClick={() => navigate("/about")}>
              About
            </li>
            <li
              className={isActive("/consulting") ? "active" : ""}
              onClick={() => navigate("/consulting")}>
              Consulting
            </li>
            <li
              className={isActive("/blogs") ? "active" : ""}
              onClick={() => navigate("/blogs")}>
              Blogs
            </li>
          </ul>
          <div className="right">
            <TbSearch onClick={() => setSearchModal(true)} />
            <div className="user-icon-wrapper">
              <LuUser onClick={toggleUserDropdown} />
              {userDropdownOpen && (
                <div
                  className={`user-dropdown ${
                    userDropdownOpen ? "active" : ""
                  }`}
                  ref={dropdownRef}>
                  {userInfo ? (
                    <>
                      <img
                        src={imageSrc}
                        alt="User"
                        onError={handleImageError}
                        className="dropdown-user-photo"
                      />
                      <span className="dropdown-user-name">
                        Hello, {userInfo.name}
                      </span>
                      <div className="btn-container">
                        <IoLogOutOutline
                          className="ddlbutton"
                          onClick={handleLogout}
                        />
                        <TbHistoryToggle
                          className="ddlbutton"
                          onClick={handleOrdersClick}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        className="dropdown-button"
                        onClick={() => {
                          navigate("/login");
                          setUserDropdownOpen(false);
                        }}>
                        Login
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            <span className="cart-icon" onClick={() => setShowCart(true)}>
              {/* <IoBagOutline /> */}
              <FiShoppingCart />
              {!!cartCount && <span>{cartCount}</span>}
            </span>
            <TbMenu2 className="menu-icon" onClick={handleMenuClick} />
          </div>
        </div>
        <div className={`dropdown-menu ${menuOpen ? "open" : ""}`}>
          <ul>
            <li
              className={isActive("/") ? "active" : ""}
              onClick={() => {
                navigate("/");
                setMenuOpen(false);
              }}>
              Home
            </li>
            <li
              className={isActive("/about") ? "active" : ""}
              onClick={() => {
                navigate("/about");
                setMenuOpen(false);
              }}>
              About
            </li>
            <li
              className={isActive("/consulting") ? "active" : ""}
              onClick={() => {
                navigate("/consulting");
                setMenuOpen(false);
              }}>
              Consulting
            </li>
            <li
              className={isActive("/blogs") ? "active" : ""}
              onClick={() => {
                navigate("/blogs");
                setMenuOpen(false);
              }}>
              Blogs
            </li>
          </ul>
        </div>
      </header>

      {searchModal && <Search setSearchModal={setSearchModal} />}
      {showCart && <Cart />}
    </>
  );
};

export default Header;
