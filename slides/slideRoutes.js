const express = require("express");
const router = express.Router();
const slideController = require("./slideController");
const upload = require("../middleware/upload");

// form-data request with file field name "image"
router.post("/slides", upload.single("image"), slideController.addSlide);
router.get("/slides", slideController.getSlides);
router.get("/slides/:id", slideController.getSlide);



module.exports = router;