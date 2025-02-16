const mongoose = require("mongoose");

const customizedOrder = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Product ID is required"],
          ref: "Product",
        },
        productName: {
          type: String,
          required: [true, "Product name is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [10, "Minimum quantity is 10"],
          max: [100, "Maximum quantity is 100"],
        },
        pricePerUnit: {
          type: Number,
          required: [true, "Price per unit is required"],
        },
        subtotal: {
          type: Number,
          required: [true, "Subtotal is required"],
        },
      },
    ],

    // Summary of the entire order
    orderSummary: {
      totalSachets: {
        type: Number,
        required: [true, "Total sachets count is required"],
      },
      totalBoxes: {
        type: Number,
        required: [true, "Total boxes count is required"],
      },
      totalPrice: {
        type: Number,
        required: [true, "Total price is required"],
      },
    },

    shippingDetails: {
      boxesRequired: {
        type: Number,
        required: [true, "Number of boxes required is required"],
      },
      estimatedWeight: {
        type: String,
        required: [true, "Estimated weight is required"],
      },
    },

    // Current status of the order
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CustomizedOrder", customizedOrder);
