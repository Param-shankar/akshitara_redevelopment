const CustomizedOrder = require("../models/customizedOrder.model");

// Create a new customized order
exports.createOrder = async (req, res) => {
  try {
    const order = new CustomizedOrder(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a specific customized order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await CustomizedOrder.findById(req.params.id)
      .populate("user_id")
      .populate("products.productId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all customized orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await CustomizedOrder.find()
      .populate("user_id")
      .populate("products.productId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a customized order
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await CustomizedOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a customized order
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await CustomizedOrder.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
