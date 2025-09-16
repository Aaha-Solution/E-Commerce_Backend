const express = require("express");
const router = express.Router();
const AuthController = require("../auth/authController");

// Routes
router.post("/signup", AuthController.signup);  // User signup
router.post("/login", AuthController.login);    // Admin & User login

module.exports = router;