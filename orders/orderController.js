const OrderModel = require("./orderModels");
const ProductModel = require("../product/productModels");

class OrderController {
    // Place an order
    static async placeOrder(req, res) {
        try {
            const { user_id, product_id, quantity } = req.body;

            const qty = parseInt(quantity) || 0;
            if (qty <= 0) {
                return res.status(400).json({ message: "Invalid quantity" });
            }

            // Get product
            const product = await ProductModel.getProductById(product_id);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            if (product.stock < qty) {
                return res.status(400).json({ message: "Not enough stock available" });
            }

            // Prices
            const unitPrice = product.final_price;
            const totalPrice = unitPrice * qty;

            // New stock
            const newStock = product.stock - qty;
            const newStockValue = product.final_price * newStock;

            // Update stock
            await ProductModel.updateStock(product_id, newStock, newStockValue);

            // Save order (default status = pending)
            const order = await OrderModel.createOrder({
                user_id,
                product_id,
                quantity: qty,
                price: unitPrice,
                total_price: totalPrice
            });

            res.json({
                message: "Order placed successfully",
                order,
                remaining_stock: newStock
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }

    // Update order status
    static async updateOrderStatus(req, res) {
        try {
            const { orderId } = req.params;
            const { status } = req.body;

            const validStatuses = ["pending", "completed", "cancelled"];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: "Invalid status value" });
            }

            const updatedOrder = await OrderModel.updateStatus(orderId, status);

            res.json({
                message: `Order status updated to ${status}`,
                order: updatedOrder
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = OrderController;
