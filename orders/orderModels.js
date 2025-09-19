const db = require("../db");

class OrderModel {
  // Create order (default status = pending)
  static async createOrder(order) {
    const { user_id, product_id, quantity, price,  totalPrice } = order;

    const sql = `
          INSERT INTO orders (user_id, product_id, quantity, price,  totalPrice, status)
          VALUES (?, ?, ?, ?, ?, 'pending')
        `;

    const [result] = await db.query(sql, [
      user_id,
      product_id,
      quantity,
      price,
      totalPrice
    ]);

    return { id: result.insertId, status: "pending", ...order };
  }

  // Get all orders (admin)
  static async getAllOrders() {
    const sql = `
          SELECT o.*, 
                 CONCAT(u.firstname, ' ', u.lastname) AS customer, 
                 u.email AS customerEmail,
                 p.name AS product
          FROM orders o
          JOIN users u ON o.user_id = u.id
          JOIN products p ON o.product_id = p.id
          ORDER BY o.created_at DESC
        `;
    const [rows] = await db.query(sql);
    return rows;
  }

  // Get orders by user
  static async getOrdersByUser(userId) {
    const sql = `
          SELECT 
              o.*, 
              p.name AS product_name,
              CONCAT(u.firstname, ' ', u.lastname) AS customer_name,
              u.email AS customer_email
          FROM orders o
          JOIN products p ON o.product_id = p.id
          JOIN users u ON o.user_id = u.id
          WHERE o.user_id = ?
          ORDER BY o.created_at DESC
        `;
    const [rows] = await db.query(sql, [userId]);
    return rows;
  }

// Update order status in DB
static async updateStatus(orderId, status) {
    const sql = `UPDATE orders SET status = ? WHERE id = ?`;

    console.log("Running SQL:", sql, "with values:", [status, orderId]);

    const [result] = await db.query(sql, [status, orderId]);
    console.log("DB Update Result:", result);

    if (result.affectedRows === 0) {
        throw new Error(`Order with ID ${orderId} not found`);
    }

    // Fetch updated order with totalPrice
    const [rows] = await db.query(
        `SELECT id, status, totalPrice 
         FROM orders 
         WHERE id = ?`,
        [orderId]
    );

    return rows[0]; // return updated row
}

  //recent orders completed
static async getRecentCompletedOrders(limit = 5) {
    const sql = `
        SELECT o.*, 
               CONCAT(u.firstname, ' ', u.lastname) AS customer, 
               u.email AS customerEmail,
               p.name AS product
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN products p ON o.product_id = p.id
        WHERE o.status = 'completed'
        ORDER BY o.created_at DESC
        LIMIT ?
    `;
    const [rows] = await db.query(sql, [limit]);
    return rows;
}
}

module.exports = OrderModel;
