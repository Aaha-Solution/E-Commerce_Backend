const express = require("express");
const router = express.Router();
const slideController = require("./slideController");

// Routes
router.get("/slides", slideController.getSlides);
router.get("/slides/:id", slideController.getSlide);
router.post("/slides", slideController.addSlide);

module.exports = router;