const Razorpay = require("razorpay");
require("dotenv").config();
console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID); // Debug
console.log("Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET); // Debug
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpay;
