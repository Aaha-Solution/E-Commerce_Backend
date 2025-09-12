const db = require("../db");

class PasswordModel {
  // check if email exists in users table
  static async checkUser(email) {
    const [rows] = await db.query("SELECT id, email FROM users WHERE email=?", [email]);
    return rows[0];
  }

static async saveOTP(email, otp, expiry) {
  // First try update
  const [update] = await db.query(
    "UPDATE password_resets SET otp=?, expiry=? WHERE email=?",
    [otp, expiry, email]
  );

  if (update.affectedRows === 0) {
    // If no row exists, insert new
    await db.query(
      "INSERT INTO password_resets (email, otp, expiry) VALUES (?, ?, ?)",
      [email, otp, expiry]
    );
  }
}

  // find OTP by email
  static async findOTP(email) {
    const [rows] = await db.query("SELECT * FROM password_resets WHERE email = ?", [email]);
    return rows[0]; // return record if exists
  }

  // delete OTP
  static async deleteOTP(email) {
    await db.query("DELETE FROM password_resets WHERE email=?", [email]);
  }

  // update password
  static async updatePassword(email, hashedPassword) {
    await db.query("UPDATE users SET password=? WHERE email=?", [hashedPassword, email]);
  }
}

module.exports = PasswordModel;
