const razorpay = require("../config/razorpay");
const Product = require("../models/product.model");
const Payment = require("../models/payment.model");
const crypto = require("crypto");

exports.createOrder = async (req, res) => {
  const { productIds, quantities, prices } = req.body;

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

    const options = {
      amount: Math.round(totalAmount * 100), // amount in the smallest currency unit
      currency: "INR",
      receipt: `order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
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
    phone_number,
  } = req.body;

  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

  const hmac = crypto.createHmac("sha256", razorpayKeySecret);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature === razorpay_signature) {
    try {
      // Fetch the products
      const products = await Product.find({ _id: { $in: productIds } });

      // Determine product details based on the source of the order
      let productDetails;
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

      // Create payment record
      const payment = new Payment({
        user_id,
        userName,
        address,
        phone_number,
        products: productDetails,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount,
        status: "success",
        delivery_status: "pending",
      });

      await payment.save();

      res.json({
        success: true,
        message: "Payment verified successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error saving payment details",
        error: error.message,
      });
    }
  } else {
    // Payment verification failed
    try {
      // Similar logic for failed payment, but with status "failure"
      const products = await Product.find({ _id: { $in: productIds } });

      let productDetails;
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
