const express = require("express");
const {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/customizedOrder.controller");

const router = express.Router();

// Create a new customized order
router.post("/", createOrder);

// Get all customized orders
router.get("/", getAllOrders);

// Get a specific customized order by ID
router.get("/:id", getOrderById);

// Update a customized order
router.put("/:id", updateOrder);

// Delete a customized order
router.delete("/:id", deleteOrder);

module.exports = router;
