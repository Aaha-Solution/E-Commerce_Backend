const db = require("../db");

class CategoriesModel {

    static async addCategory(productCategory, updatedBy = "admin") {
        // Check if category already exists
        const [existing] = await db.query(
            "SELECT id, productCategory, updatedBy, created_at, lastUpdated FROM categories WHERE productCategory = ?",
            [productCategory]
        );

        if (existing.length > 0) {
            // Return existing category
            return existing[0];
        }

        // Insert new category
        const [result] = await db.query(
            "INSERT INTO categories (productCategory, updatedBy) VALUES (?, ?)",
            [productCategory, updatedBy]
        );

        // Fetch full row including timestamps
        const [rows] = await db.query(
            "SELECT id, productCategory, updatedBy, created_at, lastUpdated FROM categories WHERE id = ?",
            [result.insertId]
        );

        return rows[0];
    }


    static async getAllCategories() {
        const [rows] = await db.query(
            "SELECT id, productCategory, updatedBy, created_at AS lastUpdated FROM categories"
        );
        return rows;
    }
    static async findById(id) {
        const [rows] = await db.query("SELECT * FROM categories WHERE id = ?", [id]);
        return rows[0] || null;
    }

    static async deleteCategory(id) {
        const [result] = await db.query("DELETE FROM categories WHERE id = ?", [id]);
        return result;
    }
}

module.exports = CategoriesModel;