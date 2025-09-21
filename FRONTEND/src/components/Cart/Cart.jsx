import React, { useContext, useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { BsBagX } from "react-icons/bs";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
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
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const statesList = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const Cart = () => {
  const { cartItems, setShowCart, cartSubTotal, setCartItems } =
    useContext(Context);
  const [userInfo, setUserInfo] = useState(null);
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Add state for shipping charges and confirmation
  const [shippingCharges, setShippingCharges] = useState(null);
  const [showShippingConfirm, setShowShippingConfirm] = useState(false);
  const [isFetchingShipping, setIsFetchingShipping] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user-info"));
    if (userData) {
      setUserInfo(userData);
    }
  }, []);

  const validateForm = () => {
    let formErrors = {};

    if (!address.trim()) formErrors.address = "Address is required";
    if (!city.trim()) formErrors.city = "City is required";
    if (!state.trim()) formErrors.state = "State is required";

    if (!pincode.trim()) {
      formErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(pincode)) {
      formErrors.pincode = "Pincode must be a 6-digit number";
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

    // Open the user info panel if it's not already open
    setIsUserInfoOpen(true);

    if (!validateForm()) {
      return;
    }

    if (!paymentMethod) {
      setSnackbar({
        open: true,
        message: "Please select a payment method (Prepaid or COD).",
        severity: "error",
      });
      return;
    }

    const productIds = cartItems.map((item) => item._id);
    const quantities = cartItems.map((item) => item.quantity);

    // Calculate total boxes (total quantity of all items)
    const boxes = cartItems.reduce((total, item) => total + item.quantity, 0);

    if (paymentMethod === "COD") {
      try {
        const boxes = cartItems.reduce(
          (total, item) => total + item.quantity,
          0
        );
        const ress = await makePaymentRequest.post(
          "/api/payments/getshipping",
          {
            pincode,
            boxes,
            cod: true,
          }
        );
        setShippingCharges(ress.data.shippingCharge);
        setShowShippingConfirm(true);
      } catch (err) {
        setSnackbar({
          open: true,
          message: "Failed to fetch shipping charges. Please try again.",
          severity: "error",
        });
      }
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

      // Calculate total boxes (total quantity of all items)
      const boxes = cartItems.reduce((total, item) => total + item.quantity, 0);

      // Pass `pincode` and `boxes` along with the order details
      const response = await makePaymentRequest.post(
        "/api/payments/create-order",
        {
          productIds,
          quantities,
          pincode, //  Added pincode
          boxes, //  Added boxes
          pincode,
          boxes,
          paymentMethod,
        }
      );

      const totalAmount = response.data.order.amount / 100.0; // Convert from paise

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        currency: response.data.order.currency,
        amount: totalAmount,
        order_id: response.data.order.id,
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
                address,
                city,
                state,
                pincode, // ✅ Included in the verification request
                phone_number: phoneNumber,
                boxes, // ✅ Included in the verification request
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

  const toggleUserInfo = () => {
    setIsUserInfoOpen(!isUserInfoOpen);
  };

  // Handler for COD radio button

  // Handler for confirming COD order after seeing shipping charges
  const handleConfirmCODOrder = async () => {
    setShowShippingConfirm(false);
    setIsFetchingShipping(false);
    // Place the COD order with confirmed total amount
    try {
      const productIds = cartItems.map((item) => item._id);
      const quantities = cartItems.map((item) => item.quantity);
      const boxes = cartItems.reduce((total, item) => total + item.quantity, 0);

      // Calculate final amount (subtotal + shippingCharges)
      const finalAmount = cartSubTotal + (shippingCharges || 0);

      await makePaymentRequest.post("/api/payments/getshipping", {
        pincode,
        boxes,
        cod: true,
      });

      await makePaymentRequest.post("/api/payments/create-order", {
        productIds,
        quantities,
        pincode,
        boxes,
        paymentMethod: "COD",
      });

      const response = await makePaymentRequest.post(
        "/api/payments/verify-payment",
        {
          productIds,
          user_id: userInfo.user_id,
          userName: userInfo.name,
          amount: finalAmount,
          cartItems,
          address,
          city,
          state,
          pincode,
          phone_number: phoneNumber,
          boxes,
          paymentMethod: "COD",
        }
      );
      setIsFetchingShipping(true);
      if (response.data.success) {
        setCartItems([]);
        setSnackbar({
          open: true,
          message: "COD Order Placed Successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "COD Order Failed! Please try again.",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "COD Order Failed! Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <div className="cart-panel">
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled">
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

        {!cartItems.length ? (
          <div className="empty-cart">
            <BsBagX />
            <span>No products in the cart.</span>
            <button className="return-cta" onClick={() => {
              setShowCart(false);
              navigate('/home')
            }}>RETURN TO SHOP</button>
          </div>
        ) : (
          <>
            <CartItem />
            <div className="cart-footer">
              <div className="subtotal">
                <div className="subtotal-main">
                  <span className="text">Subtotal:</span>
                  <span className="text total">&#8377;{cartSubTotal}</span>
                </div>
                <div className="subtotal-note">*Without delivery charges</div>
              </div>

              <div className="user-info-toggle" onClick={toggleUserInfo}>
                <span>Delivery Information</span>
                {isUserInfoOpen ? <IoIosArrowDown /> : <IoIosArrowUp />}
              </div>

              <div className={`user-info ${isUserInfoOpen ? "open" : ""}`}>
                <input
                  type="text"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                {errors.address && (
                  <span className="error">{errors.address}</span>
                )}

                <input
                  type="text"
                  placeholder="Enter your city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                {errors.city && <span className="error">{errors.city}</span>}

                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={errors.state ? "error" : ""}>
                  <option value="">Select State</option>
                  {statesList.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                {errors.state && <span className="error">{errors.state}</span>}

                <input
                  type="text"
                  placeholder="Enter your pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
                {errors.pincode && (
                  <span className="error">{errors.pincode}</span>
                )}

                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                {errors.phoneNumber && (
                  <span className="error">{errors.phoneNumber}</span>
                )}
              </div>
              
              {/* Styled Payment Method Section */}
              <div className="payment-method">
                <div className="payment-method-title">
                  Payment Method
                </div>
                <div className="payment-method-options">
                  <label className={`payment-option ${paymentMethod === "Prepaid" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      value="Prepaid"
                      checked={paymentMethod === "Prepaid"}
                      onChange={(e) => {
                        setShowShippingConfirm(false);
                        return setPaymentMethod(e.target.value);
                      }}
                    />
                    Prepaid (Razorpay)
                  </label>
                  <label className={`payment-option ${paymentMethod === "COD" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => {
                        if (!validateForm()) {
                          setIsUserInfoOpen(true);
                          setShowShippingConfirm(false);
                        } else {
                          setShowShippingConfirm(true);
                        }
                        return setPaymentMethod(e.target.value);
                      }}
                    />
                    Cash on Delivery (COD)
                  </label>
                </div>
              </div>

              {/* COD final confirmation for shipping charges */}
              {showShippingConfirm && (
                <div className="cod-confirm">
                  <p>
                    Final Amount (including shipping): ₹
                    {cartSubTotal + (shippingCharges || 0)}
                  </p>
                  <button
                    onClick={handleConfirmCODOrder}
                    disabled={isFetchingShipping}>
                    Confirm COD Order
                  </button>
                </div>
              )}
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
