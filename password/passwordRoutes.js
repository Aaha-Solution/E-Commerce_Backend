const express = require("express");
const router = express.Router();
const PasswordController = require("./passwordController");

router.post("/send-otp", PasswordController.sendOTP);
router.post("/reset-password", PasswordController.resetPassword);

module.exports = router;
