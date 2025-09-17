const express = require("express");
const router = express.Router();
const ProductController = require("../product/productController");
const upload = require("../middleware/upload");

// Routes
// Add product with image
router.post("/add", upload.single("image"), ProductController.addProduct);

// Get all products
router.get("/", ProductController.getAllProducts);


module.exports = router;