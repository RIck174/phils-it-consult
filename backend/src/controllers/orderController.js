const pool = require("../db");

const createOrder = async (req, res) => {
  try {
    const { totalAmount, status } = req.body;

    const newOrder = await pool.query(
      `
            INSERT INTO orders (user_id,total_amount)
            VALUES($1,$2)`,
      [req.user.id, totalAmount],
    );

    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error. Failed to place order" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const delete_Order = await pool.query(
      `
            DELETE FROM orders WHERE id=$1`,
      [req.params.id],
    );

    res.status(200).json({ message: "Order successfully cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Failed to cancel order" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const getOrders = await pool.query(`
            SELECT * FROM orders`);

    res.json(getOrders.rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", err: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const fetchOrder = await pool.query(
      `
            SELECT * FROM orders WHERE id =$1`,
      [req.params.id],
    );

    if (!fetchOrder.rows[0]) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(fetchOrder.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch order", err: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updateOrder = await pool.query(
      `
            UPDATE orders SET status=$1 WHERE id=$2
            
            RETURNING *`,
      [status, req.params.id],
    );

    res.status(200).json({ message: "Order updated succesfully" });
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
