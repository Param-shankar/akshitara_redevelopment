// routes/reviewRoutes.js
const express = require("express");
const { addReview } = require("../controllers/review.controller");

const router = express.Router();

router.post("/", addReview);

module.exports = router;
