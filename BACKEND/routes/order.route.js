const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrdersByUserId,
  updateDeliveryStatus,
} = require("../controllers/order.controller");

router.get("/user/:userId", getOrdersByUserId);

// Route to fetch all orders
router.get("/", getAllOrders);

router.put("/:paymentId", updateDeliveryStatus);

// Route to fetch orders by user ID

module.exports = router;
