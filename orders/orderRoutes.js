const express = require("express");
const OrderController = require("../orders/orderController");
const OrderModel = require("../orders/orderModels");

const router = express.Router();

// Place new order
router.post("/userOrders", OrderController.placeOrder);

// Get all orders (admin)
router.get("/getOrders", async (req, res) => {
    try {
        const orders = await OrderModel.getAllOrders();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get orders by user
router.get("/orders/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await OrderModel.getOrdersByUser(userId);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update order status
router.put("/orders/:orderId/status", OrderController.updateOrderStatus);


//total orders
router.get("/totalOrders", async (req, res) => {
    try {
        const orders = await OrderModel.getAllOrders();
        res.json({ totalOrders: orders.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
});

//recent orders completed
router.get("/adrecentOrders", async (req, res) => {
  try {
    const recentOrders = await OrderModel.getRecentCompletedOrders(5);
    res.json(recentOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;