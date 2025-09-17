const ProductModel = require("../product/productModels");
const CategoriesModel = require("../adminCategories/categoriesModels");

class ProductController {
    static async addProduct(req, res) {
        try {
            console.log("Incoming request body:", req.body);
            console.log("Incoming file:", req.file);

            let { name, price, discount, rating, category, stock, description } = req.body;
            const image = req.file ? req.file.filename : null;

            // Convert strings to numbers
            price = parseFloat(price) || 0;
            discount = parseFloat(discount) || 0;
            stock = parseInt(stock) || 0;

            // Calculate final price
            let finalPrice = price;
            if (discount > 0) {
                finalPrice = price - (price * discount / 100);
            }

            // Calculate stock value
            const stockValue = finalPrice * stock;

            // Find or create category
            let category_id = null;
            if (category) {
                const existingCategory = await CategoriesModel.getAllCategories();
                const found = existingCategory.find(c => c.productCategory === category);

                if (found) {
                    category_id = found.id;
                } else {
                    const newCategory = await CategoriesModel.addCategory(category, "admin");
                    category_id = newCategory.id;
                }
            }

            const productData = {
                name,
                price,
                discount,
                final_price: finalPrice,
                rating,
                category_id,
                stock,
                stock_value: stockValue,
                description,
                image
            };

            const product = await ProductModel.createProduct(productData);

            res.json({
                message: "Product added successfully",
                product
            });
        } catch (err) {
            console.error("Error adding product:", err);
            res.status(500).json({ error: err.message });
        }
    }

    static async getAllProducts(req, res) {
        try {
            const products = await ProductModel.getAllProducts();
            res.json(products);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = ProductController;
