const express = require("express");
const {googleLogin} =require("../controllers/auth.controller")
const router = express.Router();

router.get("/google", googleLogin)

module.exports = router;
