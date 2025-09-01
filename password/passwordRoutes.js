const express = require("express");
const router = express.Router();
const PasswordController = require("./passwordController");

// Step 1 + Step 2 combined
router.post("/verify-email-otp", PasswordController.verifyAndSendOTP);

// Step 3: Reset Password
router.post("/reset-password", PasswordController.resetPassword);

module.exports = router;
