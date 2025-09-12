const express = require("express");
const router = express.Router();
const PasswordController = require("./passwordController");

// Step 1 + Step 2: Verify email & send OTP
router.post("/verify-email-otp", PasswordController.verifyAndSendOTP);

// Step 2.5: Verify OTP only
router.post("/verify-otp", PasswordController.verifyOTP);

// Step 3: Reset Password
router.post("/reset-password", PasswordController.resetPassword);

module.exports = router;
