const razorpay = require("../config/razorpay");
const Product = require("../models/product.model");
const Payment = require("../models/payment.model");
const User = require("../models/user.model");
const crypto = require("crypto");
const {
  createShiprocketOrder,
  calculateShippingCharge,
} = require("../config/shiprocket");

exports.calcshppingcode = async (req, res) => {
  
  const { pincode, cod , boxes} = req.body;
  const boxLength = 23; // cm
  const boxWidth = 7.62; // cm
  const boxHeight = 8.89; // cm
  const boxWeight = 150; // grams

  const packageDimensions = {
    length: boxLength,
    width: Math.min(boxes, 5) * boxWidth, // Max 5 boxes in width
    height: Math.ceil(boxes / 5) * boxHeight, // Stack boxes if more than 5
    weight: (boxes * boxWeight) / 1000, // Convert grams to kg
  };

  
  try {
    const { shippingCharge, courierName, courierId } =
      await calculateShippingCharge(
        pincode,
        packageDimensions.weight,
        packageDimensions.length,
        packageDimensions.width,
        packageDimensions.height,
        cod,
      );
    res.json({ shippingCharge, courierName, courierId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.createOrder = async (req, res) => {
  // const { productIds, quantities, prices, pincode, boxes } = req.body;
  const { productIds, quantities, prices, pincode, boxes, paymentMethod } =
    req.body;
  try {
    // Fetch the products by their IDs
    const products = await Product.find({ _id: { $in: productIds } });

    // Calculate the total amount
    let totalAmount;
    if (prices) {
      // If prices are provided (from Suggest.jsx)
      totalAmount = prices;
    } else {
      // If prices are not provided (from Cart.jsx)
      totalAmount = products.reduce((total, product, index) => {
        return total + product.price * quantities[index];
      }, 0);
    }

    // ✅ Calculate package dimensions
    const boxLength = 23; // cm
    const boxWidth = 7.62; // cm
    const boxHeight = 8.89; // cm
    const boxWeight = 150; // grams

    const packageDimensions = {
      length: boxLength,
      width: Math.min(boxes, 5) * boxWidth, // Max 5 boxes in width
      height: Math.ceil(boxes / 5) * boxHeight, // Stack boxes if more than 5
      weight: (boxes * boxWeight) / 1000, // Convert grams to kg
    };

    // ✅ Calculate shipping charge
    const { shippingCharge, courierName, courierId } =
      await calculateShippingCharge(
        pincode,
        packageDimensions.weight,
        packageDimensions.length,
        packageDimensions.width,
        packageDimensions.height,
        paymentMethod === "COD" ? true : false
      );

    // ✅ Add shipping charge to total
    const finalAmount = totalAmount + shippingCharge;
    console.log("shipping Amount:", shippingCharge);
    console.log("Final Amount:", finalAmount);

    if (paymentMethod === "COD") {
      console.log("shipping Amount:", shippingCharge);
      return res.json({
        success: true,
        order: {
          id: `cod_${Date.now()}`,
          amount: finalAmount,
          currency: "INR",
          method: "COD",
        },
        shippingCharge,
        courierName,
        courierId,
      });
    }

    const options = {
      amount: Math.round(finalAmount * 100), // Convert to paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
      shippingCharge,
      courierName,
      courierId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    productIds,
    userName,
    user_id,
    amount,
    orderDetails, // From Suggest.jsx
    cartItems, // From Cart.jsx
    address,
    city,
    pincode,
    state,
    phone_number,
    boxes,
    paymentMethod,
  } = req.body;

  if (paymentMethod === "COD") {
    console.log("Processing COD order");
    try {
      const user = await User.findById(user_id);
      const userEmail = user ? user.email : "";

      const nameParts = userName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      const products = await Product.find({ _id: { $in: productIds } });
      let productDetails;
      if (orderDetails && orderDetails.products) {
        productDetails = orderDetails.products.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productPrice: item.pricePerUnit,
          quantity: item.quantity,
        }));
      } else if (cartItems) {
        productDetails = cartItems.map((item) => {
          const product = products.find((p) => p._id.toString() === item._id);
          return {
            productId: item._id,
            productName: product.product_name,
            productPrice: product.price,
            quantity: item.quantity,
          };
        });
      } else {
        throw new Error("Invalid order details");
      }

      const boxLength = 23; // cm
      const boxWidth = 7.62; // cm
      const boxHeight = 8.89; // cm
      const boxWeight = 150; // grams
      const packageDimensions = {
        length: boxLength,
        width: Math.min(boxes, 5) * boxWidth,
        height: Math.ceil(boxes / 5) * boxHeight,
        weight: (boxes * boxWeight) / 1000,
      };


      const shiprocketOrderData = {
        order_id: `cod_${Date.now()}`,
        order_date: new Date().toISOString(),
        pickup_location: "Primary",
        channel_id: "",
        billing_customer_name: firstName,
        billing_last_name: lastName,
        billing_address: address,
        billing_city: city,
        billing_pincode: pincode,
        billing_state: state,
        billing_country: "India",
        billing_email: userEmail,
        billing_phone: phone_number,
        shipping_is_billing: true,
        order_items: productDetails.map((p) => ({
          name: p.productName,
          sku: p.productId,
          units: p.quantity,
          selling_price: p.productPrice,
        })),
        payment_method: "COD",
        sub_total: amount,
        length: packageDimensions.length,
        breadth: packageDimensions.width,
        height: packageDimensions.height,
        weight: packageDimensions.weight,
      };

      const shiprocketResponse = await createShiprocketOrder(
        shiprocketOrderData
      );
      console.log("Shiprocket COD Order Response:", shiprocketResponse);

      const payment = new Payment({
        user_id,
        userName,
        address,
        city,
        pincode,
        state,
        phone_number,
        products: productDetails,
        amount,
        channel_order_id: shiprocketResponse.channel_order_id,
        order_id: shiprocketResponse.order_id,
        status: "success",
        delivery_status: "pending",
        payment_method: "COD",
      });
      try {
        const prod = await payment.save();
        console.log("COD Payment Record:", prod);
      } catch (error) {
        console.error("Error saving COD payment:", error);
      }
      return res.json({
        success: true,
        message: "COD order placed successfully",
        shiprocketOrder: shiprocketResponse,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error processing COD order",
        error: error.message,
      });
    }
  }

  // Verify signature for online payments
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
  const hmac = crypto.createHmac("sha256", razorpayKeySecret);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature === razorpay_signature) {
    try {
      // ✅ Fetch user email using user_id
      const user = await User.findById(user_id);
      const userEmail = user ? user.email : "";

      // ✅ Split userName into first and last name
      const nameParts = userName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      const products = await Product.find({ _id: { $in: productIds } });

      let productDetails;
      if (orderDetails && orderDetails.products) {
        productDetails = orderDetails.products.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productPrice: item.pricePerUnit,
          quantity: item.quantity,
        }));
      } else if (cartItems) {
        productDetails = cartItems.map((item) => {
          const product = products.find((p) => p._id.toString() === item._id);
          return {
            productId: item._id,
            productName: product.product_name,
            productPrice: product.price,
            quantity: item.quantity,
          };
        });
      } else {
        throw new Error("Invalid order details");
      }

      // ✅ Use Provided Boxes to Calculate Dimensions
      const boxLength = 23; // cm
      const boxWidth = 7.62; // cm
      const boxHeight = 8.89; // cm
      const boxWeight = 150; // grams

      const packageDimensions = {
        length: boxLength,
        width: Math.min(boxes, 5) * boxWidth, // Max 5 boxes in width
        height: Math.ceil(boxes / 5) * boxHeight, // Stack boxes if more than 5
        weight: (boxes * boxWeight) / 1000, // Convert grams to kg
      };

      // // ✅ Save payment record
      // const payment = new Payment({
      //   user_id,
      //   userName,
      //   address,
      //   city,
      //   pincode,
      //   state,
      //   phone_number,
      //   products: productDetails,
      //   payment_method: "Razorpay",
      //   razorpay_order_id,
      //   razorpay_payment_id,
      //   razorpay_signature,
      //   amount,
      //   status: "success",
      //   delivery_status: "pending",
      // });

      // await payment.save();

      // ✅ Create Shiprocket Order
      const shiprocketOrderData = {
        order_id: razorpay_order_id,
        order_date: new Date().toISOString(),
        pickup_location: "Primary",
        channel_id: "",
        billing_customer_name: firstName,
        billing_last_name: lastName,
        billing_address: address,
        billing_city: city,
        billing_pincode: pincode,
        billing_state: state,
        billing_country: "India",
        billing_email: userEmail,
        billing_phone: phone_number,
        shipping_is_billing: true,
        order_items: productDetails.map((p) => ({
          name: p.productName,
          sku: p.productId,
          units: p.quantity,
          selling_price: p.productPrice,
        })),
        payment_method: "Prepaid",
        sub_total: amount,
        length: packageDimensions.length,
        breadth: packageDimensions.width, // Shiprocket expects "breadth"
        height: packageDimensions.height,
        weight: packageDimensions.weight,
      };

      const shiprocketResponse = await createShiprocketOrder(
        shiprocketOrderData
      );

      // ✅ Save payment record
      const payment = new Payment({
        user_id,
        userName,
        address,
        city,
        pincode,
        state,
        phone_number,
        products: productDetails,
        payment_method: "Razorpay",
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount,
        order_id: shiprocketResponse.order_id,
        status: "success",
        delivery_status: "pending",
      });

      await payment.save();

      console.log("Shiprocket Order Response:", shiprocketResponse);

      res.json({
        success: true,
        message: "Payment verified and order placed successfully",
        shiprocketOrder: shiprocketResponse,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error processing order",
        error: error.message,
      });
    }
  } else {
    // Payment verification failed
    try {
      // ❌ Payment verification failed - Store failed order
      const products = await Product.find({ _id: { $in: productIds } });

      let productDetails = [];
      if (orderDetails && orderDetails.products) {
        // From Suggest.jsx
        productDetails = orderDetails.products.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productPrice: item.pricePerUnit,
          quantity: item.quantity,
        }));
      } else if (cartItems) {
        // From Cart.jsx
        productDetails = cartItems.map((item) => {
          const product = products.find((p) => p._id.toString() === item._id);
          return {
            productId: item._id,
            productName: product.product_name,
            productPrice: product.price,
            quantity: item.quantity,
          };
        });
      } else {
        throw new Error("Invalid order details");
      }

      const payment = new Payment({
        user_id,
        userName,
        address,
        city,
        pincode,
        state,
        phone_number,
        products: productDetails,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount,
        status: "failure",
      });

      await payment.save();

      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error saving payment details",
        error: error.message,
      });
    }
  }
};
