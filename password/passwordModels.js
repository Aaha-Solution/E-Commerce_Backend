const db = require("../db");

class PasswordModel {
  static async saveOTP(email, otp, expiry) {
    const [result] = await db.query(
      "INSERT INTO password_resets (email, otp, expiry) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp=?, expiry=?",
      [email, otp, expiry, otp, expiry]
    );
    return result;
  }

  static async findOTP(email) {
    const [rows] = await db.query(
      "SELECT * FROM password_resets WHERE email=?",
      [email]
    );
    return rows[0];
  }

  static async deleteOTP(email) {
    await db.query("DELETE FROM password_resets WHERE email=?", [email]);
  }

  static async updatePassword(email, hashedPassword) {
    await db.query(
      "UPDATE users SET password=? WHERE email=?",
      [hashedPassword, email]
    );
  }
}

module.exports = PasswordModel;
