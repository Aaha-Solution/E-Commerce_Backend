const db = require("../db");

class AuthModel {
  static async create(firstname, lastname, email, password, role = "user") {
    const [result] = await db.query(
      "INSERT INTO users (firstname, lastname, email, mobile, password, role) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, email, mobile, password, role]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  }
}

module.exports = AuthModel;
