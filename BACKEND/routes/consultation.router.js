// routes/consultingRoutes.js
const express = require("express");
const router = express.Router();
const {
  createConsultation,
} = require("../controllers/consultation.controller");

// POST request to submit the consulting form
router.post("/", createConsultation);

module.exports = router;
