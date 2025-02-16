// controllers/reviewController.js
const Review = require("../models/review.model");

exports.addReview = async (req, res) => {
  const { user_id, product_id, rating, text } = req.body;

  try {
    const newReview = new Review({
      user_id,
      product_id,
      rating,
      text,
      created_at: new Date(),
    });

    const savedReview = await newReview.save();
    return res.status(201).json({ success: true, review: savedReview });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
