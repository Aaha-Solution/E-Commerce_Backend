const express = require("express");
const router = express.Router();
const slideController = require("./slideController");
const upload = require("../middleware/upload");

// form-data request with file field name "image"
// Create a new slide with image upload
router.post("/create", upload.single("image"), slideController.addSlide);

// Get all slides
router.get("/get", slideController.getSlides);

// Get slide by ID
router.get("/get/:id", slideController.getSlide);



module.exports = router;