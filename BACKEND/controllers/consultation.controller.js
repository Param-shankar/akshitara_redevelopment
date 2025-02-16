const Consultation = require("../models/consultation.model");

const createConsultation = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const newConsultation = new Consultation({
      name,
      email,
      phone,
      message,
    });

    await newConsultation.save();

    res
      .status(201)
      .json({ message: "Consultation request submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = {
  createConsultation,
};
