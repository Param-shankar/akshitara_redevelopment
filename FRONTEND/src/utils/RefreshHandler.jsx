import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function RefreshHandler({ setisAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const data = localStorage.getItem("user-info");
    const token = JSON.parse(data)?.token;
    
    if (token) {
      setisAuthenticated(true);
      // Prevent unnecessary navigation if already on the correct page
      if (location.pathname === "/login") {
        navigate("/", { replace: true });
      }
    } else {
      setisAuthenticated(false);
    }
    // The dependency array includes only necessary dependencies
  }, [setisAuthenticated, navigate]);

  return null;
}

export default RefreshHandler;
