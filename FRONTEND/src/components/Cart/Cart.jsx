import React, { useContext, useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { BsBagX } from "react-icons/bs";
import { Context } from "../../utils/context";
import CartItem from "./CartItem/CartItem";
import { makePaymentRequest } from "../../utils/api";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

import "./Cart.scss";

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const Cart = () => {
  const { cartItems, setShowCart, cartSubTotal, setCartItems } =
    useContext(Context);
  const [userInfo, setUserInfo] = useState(null);
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user-info"));
    if (userData) {
      setUserInfo(userData);
    }
  }, []);

  const validateForm = () => {
    let formErrors = {};

    if (!address.trim()) {
      formErrors.address = "Address is required";
    }
    if (!phoneNumber.trim()) {
      formErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      formErrors.phoneNumber = "Invalid phone number format";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    if (!validateForm()) {
      return;
    }

    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      setSnackbar({
        open: true,
        message: "Razorpay SDK failed to load. Are you online?",
        severity: "error",
      });
      return;
    }

    try {
      const productIds = cartItems.map((item) => item._id);
      const quantities = cartItems.map((item) => item.quantity);

      const response = await makePaymentRequest.post(
        "/api/payments/create-order",
        {
          productIds,
          quantities,
        }
      );

      const totalAmount = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      const options = {
        key: process.env.RAZORPAY_KEY,
        currency: response.data.currency,
        amount: totalAmount * 100,
        order_id: response.data.id,
        name: "Akshitara",
        description: "Transaction to Akshitara",
        image:
          "https://res.cloudinary.com/dkvtnjc2f/image/upload/v1739384482/stb6w5noz8zmgnp4a2sh.png",
        handler: async function (response) {
          try {
            const verifyResponse = await makePaymentRequest.post(
              "/api/payments/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                productIds,
                user_id: userInfo.user_id,
                userName: userInfo.name,
                amount: totalAmount,
                cartItems,
                address: address,
                phone_number: phoneNumber,
              }
            );

            if (verifyResponse.data.success) {
              setCartItems([]);
              setSnackbar({
                open: true,
                message: "Payment Successful! Thank you for your purchase.",
                severity: "success",
              });
            } else {
              setSnackbar({
                open: true,
                message: "Payment Failed! Please try again.",
                severity: "error",
              });
            }
          } catch (err) {
            setSnackbar({
              open: true,
              message: "Payment Failed! Please try again.",
              severity: "error",
            });
          }
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Payment Failed! Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="cart-panel">
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <div className="opac-layer" onClick={() => setShowCart(false)}></div>
      <div className="cart-content">
        <div className="cart-header">
          <span className="heading">Shopping Cart</span>
          <span className="close-btn" onClick={() => setShowCart(false)}>
            <MdClose className="close-btn" />
            <span className="text">close</span>
          </span>
        </div>

        {!cartItems.length && (
          <div className="empty-cart">
            <BsBagX />
            <span>No products in the cart.</span>
            <button className="return-cta" onClick={() => {}}>
              RETURN TO SHOP
            </button>
          </div>
        )}

        {!!cartItems.length && (
          <>
            <CartItem />
            <div className="cart-footer">
              <div className="user-info">
                <input
                  type="text"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={errors.address ? "error" : ""}
                />
                {errors.address && (
                  <span className="error-message">{errors.address}</span>
                )}
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={errors.phoneNumber ? "error" : ""}
                />
                {errors.phoneNumber && (
                  <span className="error-message">{errors.phoneNumber}</span>
                )}
              </div>
              <div className="subtotal">
                <span className="text">Subtotal:</span>
                <span className="text total">&#8377;{cartSubTotal}</span>
              </div>
              <div className="button">
                <button className="checkout-cta" onClick={handlePayment}>
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
