const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const PasswordModel = require("./passwordModels");

// setup mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or your SMTP service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

class PasswordController {
  // Step 1: Send OTP
  static async sendOTP(req, res) {
    try {
      const { email } = req.body;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = Date.now() + 5 * 60 * 1000; // 5 min validity

      await PasswordModel.saveOTP(email, otp, expiry);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
      });

      res.json({ message: "OTP sent successfully" });
    } catch (err) {
      console.error("Error sending OTP:", err);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  }

  // Step 2: Verify OTP & Reset Password
  static async resetPassword(req, res) {
    try {
      const { email, otp, newPassword } = req.body;
      const record = await PasswordModel.findOTP(email);

      if (!record) {
        return res.status(400).json({ message: "No OTP found. Request again." });
      }

      if (record.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      if (Date.now() > record.expiry) {
        return res.status(400).json({ message: "OTP expired" });
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      await PasswordModel.updatePassword(email, hashed);
      await PasswordModel.deleteOTP(email);

      res.json({ message: "Password reset successful" });
    } catch (err) {
      console.error("Error resetting password:", err);
      res.status(500).json({ error: "Failed to reset password" });
    }
  }
}

module.exports = PasswordController;
