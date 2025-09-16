const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const PasswordModel = require("./passwordModels");

// setup mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // use Gmail or replace with SMTP provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

class PasswordController {
  // Step 1 + Step 2: Verify Email & Send OTP
  static async verifyAndSendOTP(req, res) {
    try {
      const { email } = req.body;
      console.log("Verifying email & sending OTP for:", email);

      //Check if user exists
      const user = await PasswordModel.checkUser(email);
      if (!user) {
        console.log("Email not found:", email);
        return res.status(404).json({ message: "Email not registered" });
      }

      //Generate OTP once
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = Date.now() + 5 * 60 * 1000; // 5 min validity
      console.log("Generated OTP:", otp, "Expiry:", new Date(expiry).toISOString());

      //Save OTP in DB
      await PasswordModel.saveOTP(email, otp, expiry);
      console.log("OTP saved to DB for:", email);

      //Send email with same OTP
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
      });
      console.log("OTP email sent to:", email);

      res.json({ message: "OTP sent successfully" });
    } catch (err) {
      console.error("Error in verifyAndSendOTP:", err);
      res.status(500).json({ error: "Failed to process request" });
    }
  }

  // Step 2.5: Verify OTP only
  static async verifyOTP(req, res) {
    try {
      const { email, otp } = req.body;
      console.log("Verifying OTP for:", email, otp);

      //Get OTP record by email
      const record = await PasswordModel.findOTP(email);
      if (!record) {
        return res.status(400).json({ message: "No OTP found. Request again." });
      }

      //Debug log
      console.log("DB record OTP:", record.otp, " Type:", typeof record.otp);
      console.log("User OTP:", otp, " Type:", typeof otp);

      //Compare as string
      if (String(record.otp) !== String(otp)) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      //Check expiry
      if (Date.now() > Number(record.expiry)) {
        return res.status(400).json({ message: "OTP expired" });
      }

      //(Optional) Delete OTP after success
      await PasswordModel.deleteOTP(email);

      //Success
      return res.json({ success: true, message: "OTP verified successfully" });
    } catch (err) {
      console.error("Error verifying OTP:", err);
      return res.status(500).json({ error: "Failed to verify OTP" });
    }
  }

  // Step 3: Reset Password
static async resetPassword(req, res) {
  try {
    const { email, newPassword } = req.body;
    console.log("Reset password attempt for:", email);

    // Update password directly (no hashing)
    await PasswordModel.updatePassword(email, newPassword);

    // Remove OTP (no reuse)
    await PasswordModel.deleteOTP(email);

    console.log("Password reset successful for:", email);
    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
}
  
}

module.exports = PasswordController;
