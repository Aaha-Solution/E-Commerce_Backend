const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const PasswordModel = require("./passwordModels");

// setup mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or your SMTP provider
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

      // check if user exists
      const user = await PasswordModel.checkUser(email);
      if (!user) {
        console.log("Email not found:", email);
        return res.status(404).json({ message: "Email not registered" });
      }

      // generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = Date.now() + 5 * 60 * 1000; // 5 min validity
      console.log("Generated OTP:", otp, "Expiry:", new Date(expiry).toISOString());

      // save OTP in DB
      await PasswordModel.saveOTP(email, otp, expiry);
      console.log("OTP saved to DB for:", email);

      // send email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
      });
      console.log("OTP email sent to:", email);

      res.json({ message: "Email verified & OTP sent successfully" });
    } catch (err) {
      console.error("Error in verifyAndSendOTP:", err);
      res.status(500).json({ error: "Failed to process request" });
    }
  }

  // Step 3: Verify OTP & Reset Password
  static async resetPassword(req, res) {
    try {
      const { email, newPassword} = req.body;
      console.log("Reset password attempt for:", email);
      
      const hashed = await bcrypt.hash(newPassword, 10);
      await PasswordModel.updatePassword(email, hashed);
      await PasswordModel.deleteOTP(email);

      console.log("Password reset successful for:", email);
      res.json({ message: "Password reset successful" });
    } catch (err) {
      console.error("Error resetting password:", err);
      res.status(500).json({ error: "Failed to reset password" });
    }
  }
  // Step 2.5: Verify OTP (without resetting password)
static async verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;
    console.log("Verifying OTP for:", email);

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

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
}

}

module.exports = PasswordController;
