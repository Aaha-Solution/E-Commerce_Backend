const ProductModel = require("./productModels");

class ProductController {
    static async addProduct(req, res) {
        try {
            console.log("Incoming request body:", req.body);
            console.log("Incoming file:", req.file);

            const { name, price, discount, rating, category, stock, description } = req.body;
            const image = req.file ? req.file.filename : null; // image file name

            console.log("Processed image filename:", image);

            const productId = await ProductModel.createProduct({
                name,
                price,
                discount,
                rating,
                category,
                stock,
                description,
                image
            });
            console.log("New product inserted with ID:", productId);

            res.json({ message: "Product added successfully", productId });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }

    static async getProducts(req, res) {
        try {
            console.log("Fetching all products from DB...");
            const products = await ProductModel.getAllProducts();
            console.log("Products fetched:", products.length);
            res.json({ products });
        } catch (err) {
            console.error("Error fetching products:", err);
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = ProductController;
