const CategoriesModel = require("../adminCategories/categoriesModels");

class CategoriesController {
 static async addCategory(req, res) {
    try {
        const { productCategory } = req.body;
        console.log("Add Category request body:", req.body);

        if (!productCategory) {
            console.log("productCategory is required");
            return res.status(400).json({ message: "productCategory is required" });
        }

        // Default updatedBy = admin
        const newCategory = await CategoriesModel.addCategory(productCategory, "admin");

        res.json({
            message: "Product Category added successfully",
            category: newCategory,
        });
    } catch (err) {
        console.error("Error adding product category:", err);
        res.status(500).json({ error: err.message });
    }           
}

    
    static async getCategories(req, res) {
        try {
            const categories = await CategoriesModel.getAllCategories();
            res.json({ categories });
        } catch (err) {
            console.error("Error fetching product categories:", err);
            res.status(500).json({ error: err.message });
        }
    }
    static async deleteCategory(req, res) {
        try {
            const { id } = req.params; // <-- get id from URL
            // console.log("Delete request for category ID:", id);

            // Check if category exists
            const category = await CategoriesModel.findById(id);
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            await CategoriesModel.deleteCategory(id);
            // console.log("Deleted category ID:", id);

            res.json({
                message: "Category deleted successfully",
                deletedCategory: category, // return deleted record info
            });
        } catch (err) {
            console.error("Error during category deletion:", err);
            res.status(500).json({ error: err.message });
        }
    }
}
module.exports = CategoriesController;