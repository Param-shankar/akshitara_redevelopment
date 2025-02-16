const Payment = require("../models/payment.model"); // Import the Payment model

// Endpoint to fetch all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Payment.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Endpoint to fetch orders by user ID
exports.getOrdersByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Payment.find({ user_id: userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  const { paymentId } = req.params; // Should match the route parameter in router
  const { delivery_status } = req.body; // New delivery status from request body

  try {
    // Update delivery status
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { delivery_status },
      { new: true } // Return the updated document
    );

    if (!updatedPayment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json(updatedPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
