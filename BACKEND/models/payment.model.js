const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  // address: {
  //   type: String,
  //   required: true, // Ensure it's required, or make it optional based on your need
  // },
  // phone_number: {
  //   type: String,
  //   required: true, // Ensure it's required, or make it optional
  // },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      productPrice: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  payment_method: {
    type: String,
    enum: ["Razorpay", "COD"],
    required: true,
  },
  order_id: {
    type: Number,
    // required: function () {
    //   return this.payment_method === "COD";
    // },
    required: true,
  },
  channel_order_id: {
    type: String,
    required: function () {
      return this.payment_method === "COD";
    },
  },
  razorpay_order_id: {
    type: String,
    required: function () {
      return this.payment_method === "Razorpay";
    },
  },
  razorpay_payment_id: {
    type: String,
    required: function () {
      return this.payment_method === "Razorpay";
    },
  },
  razorpay_signature: {
    type: String,
    required: function () {
      return this.payment_method === "Razorpay";
    },
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["success", "failure"],
    required: true,
  },
  delivery_status: {
    type: String,
    enum: ["pending", "delivered"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
