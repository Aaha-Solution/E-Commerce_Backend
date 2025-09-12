const express = require("express");
const router = express.Router();
const ProductController = require("./productController");
const upload = require("../middleware/upload");

// Routes
// Add product with image
router.post("/add", upload.single("image"), ProductController.addProduct);

// Get all products
router.get("/", ProductController.getProducts);


module.exports = router;