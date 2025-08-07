const authModels = require('./authModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

class AuthController {
    async createUser(req, res) {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, email, and password are required" });
        }

        try {
            const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

            if (existingUsers.length > 0) {
                return res.status(400).json({ message: "User already exists" });
            }

           const hashedPassword = await bcrypt.hash(password, 10);

            await authModels.createUser(username, email, hashedPassword, role); 
            console.log("User created successfully:", username);

            res.status(201).json({ message: "User created successfully" });

        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        try {
            const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
            const user = users[0];

            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            // Add role-based redirect path
            const redirectTo = user.role === 'admin' ? '/adminpanel' : '/userdashboard';

            res.status(200).json({ message: "Login successful", token, role: user.role, redirectTo });

        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = new AuthController();
