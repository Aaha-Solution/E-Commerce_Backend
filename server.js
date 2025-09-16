const express = require("express");
const cors = require("cors");
const path = require("path");
const os = require("os");

// Import Middleware
const ipWhitelist = require("./middleware/ipWhitelist");

// Import routes
const adminRoutes = require('./admin/adminRoutes');
const authRoutes = require('./auth/authRoutes');
const passwordRoutes = require('./password/passwordRoutes');
const productRoutes = require('./product/productRoutes');
const slideRoutes = require('./slides/slideRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use IP Whitelist Globally
app.use(ipWhitelist);

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/password', passwordRoutes);
app.use('/product', productRoutes);
app.use('/slides', slideRoutes);


// Serve React frontend
app.use(express.static(path.join(__dirname, "frontend/build")));

//Catch-all route for React (Express v5 safe)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend/build", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running at: http://0.0.0.0:${PORT}`);

  // Show LAN IPs
  const networkInterfaces = os.networkInterfaces();
  console.log("Available on:");
  for (const iface of Object.values(networkInterfaces)) {
    iface.forEach(details => {
      if (details.family === "IPv4" && !details.internal) {
        console.log(`➡ http://${details.address}:${PORT}`);
      }
    });
  }
});
