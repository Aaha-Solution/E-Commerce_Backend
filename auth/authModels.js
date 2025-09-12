const db = require("../db");

class AuthModel {
  static async create(firstname, lastname, email, mobile, password, role = "user") {
    const [result] = await db.query(
      "INSERT INTO users (firstname, lastname, mobile, email,  password, role) VALUES (?, ?, ?, ?, ?, ?)",
      [firstname, lastname, mobile, email, password, role]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  }

  static async getAllUsers() {
    const [rows] = await db.query("SELECT * FROM users"); // fetch all columns
    // Add a merged 'name' field
    return rows.map(user => ({
      ...user,
      name: `${user.firstname} ${user.lastname}`
    }));
  }
}

module.exports = AuthModel;
