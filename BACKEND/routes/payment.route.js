const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, calcshppingcode } = require('../controllers/payment.controller');

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.post('/getshipping', calcshppingcode);

module.exports = router;
