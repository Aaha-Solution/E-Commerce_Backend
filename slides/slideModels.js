const db = require("../db");

class SlideModel {
  // Get all slides with perfume details
  static async getAllSlides() {
    const [rows] = await db.query(
      `SELECT s.id, s.title, s.description, s.buttonText,
              p.brand, p.name, p.collection, p.image
       FROM slides s
       JOIN perfumes p ON s.perfume_id = p.id`
    );
    return rows;
  }

  // Get slide by ID
  static async getSlideById(id) {
    const [rows] = await db.query(
      `SELECT s.id, s.title, s.description, s.buttonText,
              p.brand, p.name, p.collection, p.image
       FROM slides s
       JOIN perfumes p ON s.perfume_id = p.id
       WHERE s.id = ?`,
      [id]
    );
    return rows[0];
  }

  // Create a new slide with perfume
  static async createSlide(slideData, perfumeData) {
    const [perfume] = await db.query(
      "INSERT INTO perfumes (brand, name, collection, image) VALUES (?, ?, ?, ?)",
      [perfumeData.brand, perfumeData.name, perfumeData.collection, perfumeData.image]
    );

    const [slide] = await db.query(
      "INSERT INTO slides (title, description, buttonText, perfume_id) VALUES (?, ?, ?, ?)",
      [slideData.title, slideData.description, slideData.buttonText, perfume.insertId]
    );

    return slide.insertId;
  }
}

module.exports = SlideModel;