const express = require("express");
const router = express.Router();
const db = require("../db"); // adjust path to your db connection

// Dashboard stats API
router.get("/adstats", async (req, res) => {
  try {
    const [[{ totalOrders }]] = await db.query("SELECT COUNT(*) AS totalOrders FROM orders");
    const [[{ totalProducts }]] = await db.query("SELECT COUNT(*) AS totalProducts FROM products");
    const [[{ totalUsers }]] = await db.query("SELECT COUNT(*) AS totalUsers FROM users");

    res.json({
      orders: totalOrders,
      products: totalProducts,
      users: totalUsers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

module.exports = router;



// const express = require("express");
// const router = express.Router();
// const db = require("../db"); // adjust path to your db connection

// // Get total orders
// router.get("/total-orders", async (req, res) => {
//   try {
//     const [[{ totalOrders }]] = await db.query("SELECT COUNT(*) AS totalOrders FROM orders");
//     res.json({ orders: totalOrders });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch total orders" });
//   }
// });

// // Get total products
// router.get("/total-products", async (req, res) => {
//   try {
//     const [[{ totalProducts }]] = await db.query("SELECT COUNT(*) AS totalProducts FROM products");
//     res.json({ products: totalProducts });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch total products" });
//   }
// });

// // Get total users
// router.get("/total-users", async (req, res) => {
//   try {
//     const [[{ totalUsers }]] = await db.query("SELECT COUNT(*) AS totalUsers FROM users");
//     res.json({ users: totalUsers });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch total users" });
//   }
// });

// module.exports = router;
