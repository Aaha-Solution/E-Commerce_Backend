const db = require("../db");

class AuthModel {
  static async create(firstname, lastname, email, mobile, password, role = "user") {
    const [result] = await db.query(
      "INSERT INTO users (firstname, lastname, mobile, email,  password, role) VALUES (?, ?, ?, ?, ?, ?)",
      [firstname, lastname, mobile, email, password, role]
    );
    return result.insertId;
  }

 

}

module.exports = AuthModel;
