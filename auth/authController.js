// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthModel = require("../auth/authModels");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

class AuthController {
  // User Signup
  static async signup(req, res) {
    try {
      const { firstname, lastname, mobile, email, password } = req.body;
      console.log("Signup request body:", req.body);

      const existing = await AuthModel.findByEmail(email);
      if (existing) {
        console.log("Email already exists", email);
        return res.status(400).json({ message: "Email already exists" });
      }
      // const hashedPassword = await bcrypt.hash(password, 10);
      // console.log("Hashed password:", hashedPassword);

      const userId = await AuthModel.create(
        firstname, lastname, email, mobile, /*hashedPassword,*/ password, "user"
      );

      console.log("User created with ID:", userId);

      res.json({
        message: "User registered successfully",
        userId,
        role: "user"
      });

    } catch (err) {
      console.error("Error during signup:", err);
      res.status(500).json({ error: err.message });
    }
  }

  // Login (Admin + User)
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      console.log("Login request body:", req.body);
      const user = await AuthModel.findByEmail(email);

      if (!user) {
        console.log("User not found with email:", email);
        return res.status(400).json({ message: "Invalid credentials" });
      }

      let valid = false;

      if (user.role === "admin") {
        // Compare plain text (⚠️ insecure!)
        valid = (password === user.password);
      } else {
        // Compare with bcrypt (normal users)
        // valid = await bcrypt.compare(password, user.password);
         valid = (password === user.password);
      }

      if (!valid) {
        console.log("Invalid password for user:", email);
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
      console.log("Login successful for user:", email);

      res.json({ message: "Login successful", token, role: user.role });
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ error: err.message });
    }
  }



}
module.exports = AuthController;
