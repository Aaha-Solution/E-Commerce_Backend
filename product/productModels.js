const db = require("../db");

class ProductModel {
  static async createProduct({ name, price, discount, rating, category, stock, description, image }) {
    const [result] = await db.query(
      "INSERT INTO products (name, price, discount, rating, category, stock, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, price, discount, rating, category, stock, description, image]
    );
    return result.insertId;
  }

  static async getAllProducts() {
    const [rows] = await db.query("SELECT * FROM products");
    return rows;
  }
}

module.exports = ProductModel;
