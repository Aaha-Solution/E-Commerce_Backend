const express = require("express");
const router = express.Router();
const ProductController = require("../product/productController");
const upload = require("../middleware/upload");

// Routes
// Add product with image
router.post("/add", upload.single("image"), ProductController.addProduct);

// Get all products
router.get("/adgetproduct", ProductController.getAllProducts);

//update product (admin)
router.put("/adproupdate/:id", upload.single("image"), ProductController.updateProduct);

//Delete product by ID
router.delete("/adprodelete/:id", ProductController.deleteProduct);


module.exports = router; 