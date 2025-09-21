import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import { googleAuth } from "../../utils/api";
import { IoLeafOutline, IoHomeOutline } from "react-icons/io5";
import { RiArrowGoBackLine } from "react-icons/ri";

const Login = () => {
  const navigate = useNavigate();
  const responseGoogle = async (authResult) => {
    console.log("Google auth result:", authResult);
    try {
      if (authResult["code"]) {
        const result = await googleAuth(authResult["code"]);
        console.log("Backend Google auth response:", result);
        const { email, name, image, user_id } = result.data.user;
        const isAdmin = user_id === process.env.REACT_APP_ADMIN_USER_ID;
        // console.log(image);

        const token = result.data.token;
        const obj = { email, name, image, user_id, token, isAdmin };

        localStorage.setItem("user-info", JSON.stringify(obj));
        navigate("/");
      }
    } catch (err) {
      console.error("Error during Google authentication:", err);
    }
  };

  // const googleLogin = useGoogleLogin({
  //   onSuccess: () => {
  //     console.log("ther is no error here");
  //     responseGoogle();
  //   },
  //   onError: (error) => {
  //     console.log("ther is error here");
  //     console.error("Google login error:", error);
  //   },
  //   flow: "auth-code",
  // });
  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: (error) => {
      console.error("Google login error:", error);
    },
    flow: "auth-code",
  });

  return (
    <div className="login-page">
      <RiArrowGoBackLine className="home-icon" onClick={() => navigate("/")} />
      <div className="login-container">
        <IoLeafOutline className="login-icon" />
        <h1>Welcome to Akshitara Ayurveda</h1>
        <p>Where Nature Meets Wellness</p>
        <button onClick={googleLogin} className="google-login-button">
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
