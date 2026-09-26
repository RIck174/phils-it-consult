const pool = require("../db");

const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const { items } = req.body; // items = [{ productId, quantity }, ...]

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    await client.query("BEGIN");

    // Look up real prices from the products table — never trust the client
    const productIds = items.map((i) => i.productId);
    const productsResult = await client.query(
      `SELECT id, price, stock_quantity FROM products WHERE id = ANY($1)`,
      [productIds],
    );

    const productMap = {};
    productsResult.rows.forEach((p) => (productMap[p.id] = p));

    let totalAmount = 0;
    for (const item of items) {
      const product = productMap[item.productId];
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      if (product.stock_quantity < item.quantity) {
        throw new Error(`Not enough stock for product ${item.productId}`);
      }
      totalAmount += Number(product.price) * item.quantity;
    }

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING id`,
      [req.user.id, totalAmount],
    );
    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      const product = productMap[item.productId];
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)`,
        [orderId, item.productId, item.quantity, product.price],
      );
      await client.query(
        `UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2`,
        [item.quantity, item.productId],
      );
    }

    await client.query(`DELETE FROM cart WHERE user_id = $1`, [req.user.id]);

    await client.query("COMMIT");
    res.status(201).json({ message: "Order placed successfully", orderId });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Failed to place order" });
  } finally {
    client.release();
  }
};

const cancelOrder = async (req, res) => {
  try {
    const delete_Order = await pool.query(
      `DELETE FROM orders WHERE id=$1 AND user_id=$2 RETURNING *`,
      [req.params.id, req.user.id],
    );

    if (!delete_Order.rows[0]) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order successfully cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Failed to cancel order" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const getOrders = await pool.query(`SELECT * FROM orders`);
    res.json(getOrders.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const fetchOrder = await pool.query(
      `SELECT * FROM orders WHERE id=$1 AND user_id=$2`,
      [req.params.id, req.user.id],
    );

    if (!fetchOrder.rows[0]) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(fetchOrder.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updateOrder = await pool.query(
      `UPDATE orders SET status=$1 WHERE id=$2 RETURNING *`,
      [status, req.params.id],
    );

    if (!updateOrder.rows[0]) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error, Failed to update order status" });
  }
};

module.exports = {
  createOrder,
  cancelOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
