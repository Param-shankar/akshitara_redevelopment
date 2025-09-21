// import useFetch from "../../hooks/useFetch";
// import React, { useEffect, useState } from "react";
// import { FaBox } from "react-icons/fa";
// import { FaRupeeSign } from "react-icons/fa";
// import { GiChipsBag } from "react-icons/gi";
// import { useLocation, useNavigate } from "react-router-dom";
// import { makePaymentRequest } from "../../utils/api";
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";
// import "./Suggest.scss";

// const productRecommendations = {
//   1: "66eef533e5ad9198ad850699",
//   2: "66eef533e5ad9198ad85069b",
//   3: "66eef533e5ad9198ad85069a",
//   4: "66eef533e5ad9198ad85069c",
//   5: "66eef533e5ad9198ad850694",
//   6: "66eef533e5ad9198ad85069d",
//   7: "66eef533e5ad9198ad850693",
//   8: "66eef533e5ad9198ad850698",
//   9: "66eef533e5ad9198ad850691",
//   10: "66eef533e5ad9198ad850692",
//   11: "66eef533e5ad9198ad850695",
//   12: "66eef533e5ad9198ad850697",
//   13: "66eef533e5ad9198ad85069e",
//   14: "66eef533e5ad9198ad85069f",
//   15: "66eef533e5ad9198ad8506a0",
//   16: "66eef533e5ad9198ad8506a1",
//   17: "66eef533e5ad9198ad8506a2",
//   18: "66eef533e5ad9198ad8506a3",
//   19: "66eef533e5ad9198ad8506a4",
//   20: "66eef533e5ad9198ad8506a5",
// };

// const statesList = [
//   "Andhra Pradesh",
//   "Arunachal Pradesh",
//   "Assam",
//   "Bihar",
//   "Chhattisgarh",
//   "Goa",
//   "Gujarat",
//   "Haryana",
//   "Himachal Pradesh",
//   "Jharkhand",
//   "Karnataka",
//   "Kerala",
//   "Madhya Pradesh",
//   "Maharashtra",
//   "Manipur",
//   "Meghalaya",
//   "Mizoram",
//   "Nagaland",
//   "Odisha",
//   "Punjab",
//   "Rajasthan",
//   "Sikkim",
//   "Tamil Nadu",
//   "Telangana",
//   "Tripura",
//   "Uttar Pradesh",
//   "Uttarakhand",
//   "West Bengal",
//   "Andaman and Nicobar Islands",
//   "Chandigarh",
//   "Dadra and Nagar Haveli and Daman and Diu",
//   "Delhi",
//   "Jammu and Kashmir",
//   "Ladakh",
//   "Lakshadweep",
//   "Puducherry",
// ];

// const loadScript = (src) => {
//   return new Promise((resolve) => {
//     const script = document.createElement("script");
//     script.src = src;
//     script.onload = () => {
//       resolve(true);
//     };
//     script.onerror = () => {
//       resolve(false);
//     };
//     document.body.appendChild(script);
//   });
// };

// const Suggest = React.memo(() => {
//   const { data, loading } = useFetch(`/api/products`);
//   const location = useLocation();
//   const { selectedIssuesArray } = location.state || {};
//   const [recommendations, setRecommendations] = useState([]);
//   const [userInfo, setUserInfo] = useState(null);
//   const [quantities, setQuantities] = useState({});
//   const [address, setAddress] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [errors, setErrors] = useState({});
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     type: "success",
//   });
//   const navigate = useNavigate();

//   const SACHET_PRICE = 10;
//   const BOX_CAPACITY = 40;
//   const MAX_QUANTITY = 100;

//   useEffect(() => {
//     if (selectedIssuesArray) {
//       const matchedProducts = getRecommendations(selectedIssuesArray);
//       setRecommendations(matchedProducts);
//       const initialQuantities = matchedProducts.reduce((acc, productId) => {
//         acc[productId] = 10;
//         return acc;
//       }, {});
//       setQuantities(initialQuantities);
//     }
//   }, [selectedIssuesArray]);

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem("user-info"));
//     if (userData) {
//       setUserInfo(userData);
//     }
//   }, []);

//   const validateForm = () => {
//     let formErrors = {};

//     if (!address.trim()) {
//       formErrors.address = "Address is required";
//     }
//     if (!phoneNumber.trim()) {
//       formErrors.phoneNumber = "Phone number is required";
//     } else if (!/^\d{10}$/.test(phoneNumber)) {
//       formErrors.phoneNumber = "Invalid phone number format";
//     }
//     setErrors(formErrors);
//     return Object.keys(formErrors).length === 0;
//   };

//   const getRecommendations = (selectedIssuesArray) => {
//     return selectedIssuesArray
//       .map((issue) => productRecommendations[parseInt(issue)])
//       .filter(Boolean);
//   };

//   const handleQuantityChange = (productId, change) => {
//     setQuantities((prevQuantities) => {
//       const newQuantity = Math.min(
//         MAX_QUANTITY,
//         Math.max(10, (prevQuantities[productId] || 10) + change)
//       );
//       return { ...prevQuantities, [productId]: newQuantity };
//     });
//   };

//   const calculateTotalOrder = () => {
//     const totalSachets = Object.values(quantities).reduce(
//       (sum, qty) => sum + qty,
//       0
//     );
//     const totalBoxes = Math.ceil(totalSachets / BOX_CAPACITY);
//     const totalPrice = totalSachets * SACHET_PRICE;
//     return { totalSachets, totalBoxes, totalPrice };
//   };

//   const createOrderDetails = () => {
//     const { totalSachets, totalBoxes, totalPrice } = calculateTotalOrder();

//     const orderedProducts = Object.entries(quantities).map(
//       ([productId, quantity]) => {
//         const product = data.find((p) => p._id === productId);
//         return {
//           productId: product._id,
//           productName: `${product.product_name} ${" Sachets"}`,
//           quantity: quantity,
//           pricePerUnit: SACHET_PRICE,
//           subtotal: quantity * SACHET_PRICE,
//         };
//       }
//     );

//     return {
//       user_id: userInfo.user_id,
//       orderDate: new Date().toISOString(),
//       products: orderedProducts,
//       orderSummary: {
//         totalSachets,
//         totalBoxes,
//         totalPrice,
//       },
//       shippingDetails: {
//         boxesRequired: totalBoxes,
//         estimatedWeight: `${totalSachets * 0.01}kg`,
//       },
//     };
//   };

//   const handlePayment = async () => {
//     if (userInfo == null) {
//       navigate("/login");
//       return;
//     }

//     if (!validateForm()) {
//       return;
//     }

//     const res = await loadScript(
//       "https://checkout.razorpay.com/v1/checkout.js"
//     );

//     if (!res) {
//       setSnackbar({
//         open: true,
//         message: "Razorpay SDK failed to load. Are you online?",
//         type: "error",
//       });
//       return;
//     }

//     try {
//       const productIds = Object.keys(quantities);
//       const quantities_arr = Object.values(quantities);
//       const { totalPrice, totalBoxes } = calculateTotalOrder();

//       const response = await makePaymentRequest.post(
//         "/api/payments/create-order",
//         {
//           productIds,
//           quantities: quantities_arr,
//           prices: totalPrice,
//           pincode,
//           boxes: totalBoxes,
//         }
//       );
//       const totalAmount = response.data.order.amount / 100.0; // Convert from paise
//       const options = {
//         key: process.env.REACT_APP_RAZORPAY_KEY,
//         currency: response.data.order.currency,
//         amount: totalAmount,
//         order_id: response.data.order.id,
//         name: "Akshitara",
//         description: "Transaction to Akshitara",
//         image:
//           "https://res.cloudinary.com/dkvtnjc2f/image/upload/v1739384482/stb6w5noz8zmgnp4a2sh.png",
//         handler: async function (response) {
//           try {
//             const orderDetails = createOrderDetails();
//             const verifyResponse = await makePaymentRequest.post(
//               "/api/payments/verify-payment",
//               {
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 productIds,
//                 user_id: userInfo.user_id,
//                 userName: userInfo.name,
//                 amount: totalAmount,
//                 orderDetails,
//                 boxes: totalBoxes,
//                 address,
//                 city,
//                 pincode,
//                 state,
//                 phone_number: phoneNumber,
//               }
//             );
//             if (verifyResponse.data.success) {
//               setSnackbar({
//                 open: true,
//                 message: "Payment Successful! Thank you for your purchase.",
//                 type: "success",
//               });
//               setTimeout(() => {
//                 navigate("/home");
//               }, 6000);
//               setQuantities({});
//             } else {
//               setSnackbar({
//                 open: true,
//                 message: "Payment Failed! Please try again.",
//                 type: "error",
//               });
//             }
//           } catch (err) {
//             setSnackbar({
//               open: true,
//               message: "Payment Failed! Please try again.",
//               type: "error",
//             });
//           }
//         },
//       };
//       const paymentObject = new window.Razorpay(options);
//       paymentObject.open();
//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message: "Payment Failed! Please try again.",
//         type: "error",
//       });
//     }
//   };

//   const { totalSachets, totalBoxes, totalPrice } = calculateTotalOrder();

//   return (
//     <div className="category-main-content">
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.type}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//       <div className="layout">
//         <div className="category-title">Recommendations</div>
//         {loading ? (
//           <div>Loading best products for you...</div>
//         ) : (
//           <>
//             <div className="search-results">
//               {data
//                 .filter((product) => recommendations.includes(product._id))
//                 .map((item) => {
//                   const quantity = quantities[item._id] || 10;

//                   return (
//                     <div className="search-result-item" key={item._id}>
//                       <div className="image-container">
//                         <img src={item.image} alt={item.title} />
//                       </div>
//                       <div className="prod-details">
//                         <span className="name">{item.product_name} Sachets</span>
//                         <span className="desc">{item.desc}</span>
//                       </div>
//                       <div className="quantity-controls-container">
//                         <div className="quantity-controls">
//                           <button
//                             onClick={() => handleQuantityChange(item._id, -5)}
//                           >
//                             -
//                           </button>
//                           <span>{quantity}</span>
//                           <button
//                             onClick={() => handleQuantityChange(item._id, 5)}
//                           >
//                             +
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//             </div>

//             {/* Order Summary */}
//             <div className="order-summary">
//               <div className="summary-icon">
//                 <FaBox size={200} className="icon-box" />
//               </div>
//               <div className="summary-content">
//                 <h3>Order Summary</h3>
//                 <div className="itemized-list">
//                   {Object.entries(quantities).map(([productId, qty]) => {
//                     const product = data.find((p) => p._id === productId);
//                     return (
//                       <div className="product-item" key={productId}>
//                         <span className="product-name">
//                           {product?.product_name} Sachets
//                         </span>
//                         <span className="product-quantity-price">
//                           {qty} x ₹{SACHET_PRICE}
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>
//                 <div className="summary-item highlight">
//                   <span>
//                     <GiChipsBag /> Total Sachets:
//                   </span>
//                   <span>{totalSachets}</span>
//                 </div>
//                 <div className="summary-item highlight">
//                   <span>
//                     <FaBox /> Total Boxes:
//                   </span>
//                   <span>{totalBoxes}</span>
//                 </div>
//                 <div className="summary-item highlight">
//                   <span>
//                     <FaRupeeSign /> Total Price:
//                   </span>
//                   <span>₹{totalPrice}</span>
//                 </div>
//                 <div className="user-info">
//                   <input
//                     type="text"
//                     placeholder="Enter your address"
//                     value={address}
//                     onChange={(e) => setAddress(e.target.value)}
//                     className={errors.address ? "error" : ""}
//                   />
//                   {errors.address && (
//                     <span className="error-message">{errors.address}</span>
//                   )}
//                   <input
//                     type="tel"
//                     placeholder="Enter your phone number"
//                     value={phoneNumber}
//                     onChange={(e) => setPhoneNumber(e.target.value)}
//                     className={errors.phoneNumber ? "error" : ""}
//                   />
//                   {errors.phoneNumber && (
//                     <span className="error-message">{errors.phoneNumber}</span>
//                   )}
//                   <button className="order-button" onClick={handlePayment}>
//                     Order Now
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// });

// export default Suggest;
import useFetch from "../../hooks/useFetch";
import React, { useEffect, useState } from "react";
import { FaBox } from "react-icons/fa";
import { FaRupeeSign } from "react-icons/fa";
import { GiChipsBag } from "react-icons/gi";
import { useLocation, useNavigate } from "react-router-dom";
import { makePaymentRequest } from "../../utils/api";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "./Suggest.scss";

const productRecommendations = {
  1: "66eef533e5ad9198ad850699",
  2: "66eef533e5ad9198ad85069b",
  3: "66eef533e5ad9198ad85069a",
  4: "66eef533e5ad9198ad85069c",
  5: "66eef533e5ad9198ad850694",
  6: "66eef533e5ad9198ad85069d",
  7: "66eef533e5ad9198ad850693",
  8: "66eef533e5ad9198ad850698",
  9: "66eef533e5ad9198ad850691",
  10: "66eef533e5ad9198ad850692",
  11: "66eef533e5ad9198ad850695",
  12: "66eef533e5ad9198ad850697",
  13: "66eef533e5ad9198ad85069e",
  14: "66eef533e5ad9198ad85069f",
  15: "66eef533e5ad9198ad8506a0",
  16: "66eef533e5ad9198ad8506a1",
  17: "66eef533e5ad9198ad8506a2",
  18: "66eef533e5ad9198ad8506a3",
  19: "66eef533e5ad9198ad8506a4",
  20: "66eef533e5ad9198ad8506a5",
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

const Suggest = React.memo(() => {
  const { data, loading } = useFetch(`/api/products`);
  const location = useLocation();
  const { selectedIssuesArray } = location.state || {};
  const [recommendations, setRecommendations] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const navigate = useNavigate();

  const SACHET_PRICE = 10;
  const BOX_CAPACITY = 40;
  const MAX_QUANTITY = 100;

  useEffect(() => {
    if (selectedIssuesArray) {
      const matchedProducts = getRecommendations(selectedIssuesArray);
      setRecommendations(matchedProducts);
      const initialQuantities = matchedProducts.reduce((acc, productId) => {
        acc[productId] = 10;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    }
  }, [selectedIssuesArray]);

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
    if (!pincode.trim() || !/^[0-9]{6}$/.test(pincode))
      formErrors.pincode = "Valid Pincode is required";
    if (!phoneNumber.trim() || !/^[0-9]{10}$/.test(phoneNumber))
      formErrors.phoneNumber = "Valid phone number is required";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const getRecommendations = (selectedIssuesArray) => {
    return selectedIssuesArray
      .map((issue) => productRecommendations[parseInt(issue)])
      .filter(Boolean);
  };

  const handleQuantityChange = (productId, change) => {
    setQuantities((prevQuantities) => {
      const newQuantity = Math.min(
        MAX_QUANTITY,
        Math.max(10, (prevQuantities[productId] || 10) + change)
      );
      return { ...prevQuantities, [productId]: newQuantity };
    });
  };

  const calculateTotalOrder = () => {
    const totalSachets = Object.values(quantities).reduce(
      (sum, qty) => sum + qty,
      0
    );
    const totalBoxes = Math.ceil(totalSachets / BOX_CAPACITY);
    const totalPrice = totalSachets * SACHET_PRICE;
    return { totalSachets, totalBoxes, totalPrice };
  };

  const createOrderDetails = () => {
    const { totalSachets, totalBoxes, totalPrice } = calculateTotalOrder();

    const orderedProducts = Object.entries(quantities).map(
      ([productId, quantity]) => {
        const product = data.find((p) => p._id === productId);
        return {
          productId: product._id,
          productName: `${product.product_name} ${" Sachets"}`,
          quantity: quantity,
          pricePerUnit: SACHET_PRICE,
          subtotal: quantity * SACHET_PRICE,
        };
      }
    );

    return {
      user_id: userInfo.user_id,
      orderDate: new Date().toISOString(),
      products: orderedProducts,
      orderSummary: {
        totalSachets,
        totalBoxes,
        totalPrice,
      },
      shippingDetails: {
        boxesRequired: totalBoxes,
        estimatedWeight: `${totalSachets * 0.01}kg`,
      },
    };
  };

  const [paymentMethod, setPaymentMethod] = useState("");
  const [shippingCharges, setShippingCharges] = useState(null);
  const [showShippingConfirm, setShowShippingConfirm] = useState(false);
  const [isFetchingShipping, setIsFetchingShipping] = useState(false);

  const handlePayment = async () => {
    if (userInfo == null) {
      navigate("/login");
      return;
    }
    if (!validateForm()) {
      return;
    }
    if (!paymentMethod) {
      setSnackbar({
        open: true,
        message: "Please select a payment method (Prepaid or COD).",
        type: "error",
      });
      return;
    }

    const productIds = Object.keys(quantities);
    const quantities_arr = Object.values(quantities);
    const { totalPrice, totalBoxes } = calculateTotalOrder();

    if (paymentMethod === "COD") {
      try {
        const ress = await makePaymentRequest.post(
          "/api/payments/getshipping",
          {
            pincode,
            boxes: totalBoxes,
            cod: true,
          }
        );
        setShippingCharges(ress.data.shippingCharge);
        setShowShippingConfirm(true);
      } catch (err) {
        setSnackbar({
          open: true,
          message: "Failed to fetch shipping charges. Please try again.",
          type: "error",
        });
      }
      return;
    }

    // Prepaid (Razorpay) flow
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      setSnackbar({
        open: true,
        message: "Razorpay SDK failed to load. Are you online?",
        type: "error",
      });
      return;
    }
    try {
      const response = await makePaymentRequest.post(
        "/api/payments/create-order",
        {
          productIds,
          quantities: quantities_arr,
          prices: totalPrice,
          pincode,
          boxes: totalBoxes,
          paymentMethod,
        }
      );
      const totalAmount = response.data.order.amount / 100.0;
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
            const orderDetails = createOrderDetails();
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
                orderDetails,
                boxes: totalBoxes,
                address,
                city,
                pincode,
                state,
                phone_number: phoneNumber,
              }
            );
            if (verifyResponse.data.success) {
              setSnackbar({
                open: true,
                message: "Payment Successful! Thank you for your purchase.",
                type: "success",
              });
              setTimeout(() => {
                navigate("/home");
              }, 6000);
              setQuantities({});
            } else {
              setSnackbar({
                open: true,
                message: "Payment Failed! Please try again.",
                type: "error",
              });
            }
          } catch (err) {
            setSnackbar({
              open: true,
              message: "Payment Failed! Please try again.",
              type: "error",
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
        type: "error",
      });
    }
  };

  // Handler for confirming COD order after seeing shipping charges
  const handleConfirmCODOrder = async () => {
    setShowShippingConfirm(false);
    setIsFetchingShipping(false);
    try {
      const productIds = Object.keys(quantities);
      const quantities_arr = Object.values(quantities);
      const { totalPrice, totalBoxes } = calculateTotalOrder();
      const finalAmount = totalPrice + (shippingCharges || 0);

      await makePaymentRequest.post("/api/payments/getshipping", {
        pincode,
        boxes: totalBoxes,
        cod: true,
      });

      // Place the COD order
      const orderDetails = createOrderDetails();
      const response = await makePaymentRequest.post(
        "/api/payments/verify-payment",
        {
          productIds,
          user_id: userInfo.user_id,
          userName: userInfo.name,
          amount: finalAmount,
          orderDetails,
          boxes: totalBoxes,
          address,
          city,
          state,
          pincode,
          phone_number: phoneNumber,
          paymentMethod: "COD",
        }
      );
      setIsFetchingShipping(true);
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "COD Order Placed Successfully!",
          type: "success",
        });
        setTimeout(() => {
          navigate("/home");
        }, 6000);
        setQuantities({});
      } else {
        setSnackbar({
          open: true,
          message: "COD Order Failed! Please try again.",
          type: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "COD Order Failed! Please try again.",
        type: "error",
      });
    }
  };

  const { totalSachets, totalBoxes, totalPrice } = calculateTotalOrder();

  return (
    <div className="category-main-content">
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.type}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <div className="layout">
        <div className="category-title">Recommendations</div>
        {loading ? (
          <div>Loading best products for you...</div>
        ) : (
          <>
            <div className="search-results">
              {data
                .filter((product) => recommendations.includes(product._id))
                .map((item) => {
                  const quantity = quantities[item._id] || 10;
                  return (
                    <div className="search-result-item" key={item._id}>
                      <div className="image-container">
                        <img src={item.image} alt={item.title} />
                      </div>
                      <div className="prod-details">
                        <span className="name">
                          {item.product_name} Sachets
                        </span>
                        <span className="desc">{item.desc}</span>
                      </div>
                      <div className="quantity-controls-container">
                        <div className="quantity-controls">
                          <button
                            onClick={() => handleQuantityChange(item._id, -5)}>
                            -
                          </button>
                          <span>{quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, 5)}>
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <div className="summary-icon">
                <FaBox size={200} className="icon-box" />
              </div>
              <div className="summary-content">
                <h3>Order Summary</h3>
                <div className="itemized-list">
                  {Object.entries(quantities).map(([productId, qty]) => {
                    const product = data.find((p) => p._id === productId);
                    return (
                      <div className="product-item" key={productId}>
                        <span className="product-name">
                          {product?.product_name} Sachets
                        </span>
                        <span className="product-quantity-price">
                          {qty} x ₹{SACHET_PRICE}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="summary-item highlight">
                  <span>
                    <GiChipsBag /> Total Sachets:
                  </span>
                  <span>{totalSachets}</span>
                </div>
                <div className="summary-item highlight">
                  <span>
                    <FaBox /> Total Boxes:
                  </span>
                  <span>{totalBoxes}</span>
                </div>
                <div className="summary-item highlight">
                  <span>
                    <FaRupeeSign /> Total Price:
                    <div className="subtotal-note">
                      *Without delivery charges
                    </div>
                  </span>
                  <span>₹{totalPrice}</span>
                </div>
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
                    type="text"
                    placeholder="Enter your city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={errors.city ? "error" : ""}
                  />
                  {errors.city && (
                    <span className="error-message">{errors.city}</span>
                  )}

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
                  {errors.state && (
                    <span className="error-message">{errors.state}</span>
                  )}

                  <input
                    type="text"
                    placeholder="Enter your pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className={errors.pincode ? "error" : ""}
                  />
                  {errors.pincode && (
                    <span className="error-message">{errors.pincode}</span>
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

                  {/* Payment Method Section */}
                  <div className="payment-method">
                    <div className="payment-method-title">Payment Method</div>
                    <div className="payment-method-options">
                      <label
                        className={`payment-option ${
                          paymentMethod === "Prepaid" ? "selected" : ""
                        }`}>
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
                      <label
                        className={`payment-option ${
                          paymentMethod === "COD" ? "selected" : ""
                        }`}>
                        <input
                          type="radio"
                          value="COD"
                          checked={paymentMethod === "COD"}
                          onChange={(e) => {
                            if (!validateForm()) {
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
                        {totalPrice + (shippingCharges || 0)}
                      </p>
                      <button
                        onClick={handleConfirmCODOrder}
                        disabled={isFetchingShipping}>
                        Confirm COD Order
                      </button>
                    </div>
                  )}

                  <button className="order-button" onClick={handlePayment}>
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default Suggest;
