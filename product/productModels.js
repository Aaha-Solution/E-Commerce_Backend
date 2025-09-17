const db = require("../db");

class ProductModel {
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


  static async getAllProducts() {
    const [rows] = await db.query("SELECT * FROM products");
    return rows;
  }
}

module.exports = ProductModel;
