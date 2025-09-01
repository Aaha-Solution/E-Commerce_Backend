const express = require("express");
const router = express.Router();
const PasswordController = require("./passwordController");

// Step 1: Verify email
router.post("/verify-email", PasswordController.verifyEmail);

// Step 2: Send OTP
router.post("/send-otp", PasswordController.sendOTP);

// Step 3: Reset Password
router.post("/reset-password", PasswordController.resetPassword);

module.exports = router;
