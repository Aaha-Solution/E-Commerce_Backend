const db = require("../db");

class ProductModel {
  // Create a new product
  static async createProduct(product) {
    const { name, price, discount, final_price, rating, category_id, stock, stock_value, description, image } = product;

    const sql = `
      INSERT INTO products 
      (name, price, discount, final_price, rating, category_id, stock, stock_value, description, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      name, price, discount, final_price, rating, category_id, stock, stock_value, description, image
    ]);

    return { id: result.insertId, ...product };
  }

  // Get all products
  static async getAllProducts() {
    const [rows] = await db.query("SELECT * FROM products");
    return rows;
  }

  // Get a single product by ID
  static async getProductById(id) {
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    return rows[0] || null;
  }

  // Update stock for a product
  static async updateStock(id, stock, stock_value) {
    await db.query(
      "UPDATE products SET stock = ?, stock_value = ? WHERE id = ?",
      [stock, stock_value, id]
    );
  }
}

module.exports = ProductModel;
