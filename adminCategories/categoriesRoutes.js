const express = require("express");
const router = express.Router();
const CategoriesController = require("../adminCategories/categoriesController");

router.post("/addCategory", CategoriesController.addCategory); // Add new product category
router.get("/getCategories", CategoriesController.getCategories); // Get all product categories
router.delete("/deleteCategory/:id", CategoriesController.deleteCategory); // Delete a product category by ID

module.exports = router;