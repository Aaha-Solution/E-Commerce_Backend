const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthModel = require("../auth/authModels");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

class AuthController {
  // User Signup
  static async signup(req, res) {
    try {
      const { firstname, lastname, email, password } = req.body;

      const existing = await AuthModel.findByEmail(email);
      if (existing) return res.status(400).json({ message: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const userId = await AuthModel.create(firstname, lastname, email, hashedPassword, "user");

      res.json({ message: "User registered successfully", userId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Login (Admin + User)
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await AuthModel.findByEmail(email);

      if (!user) return res.status(400).json({ message: "Invalid credentials" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

      res.json({ message: "Login successful", token, role: user.role });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = AuthController;
