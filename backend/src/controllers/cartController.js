const pool = require("../db");

const getUserCart = async (req, res) => {
  try {
    const getCart = await pool.query(`SELECT * FROM cart WHERE user_id=$1`, [
      req.user.id,
    ]);
    res.json(getCart.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const addItemToCart = async (req, res) => {
  try {
    const { quantity, productId } = req.body;
    await pool.query(
      `INSERT INTO cart(user_id,product_id,quantity) VALUES($1,$2,$3)`,
      [req.user.id, productId, quantity],
    );
    res.status(201).json({ message: "Item added to cart" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const update = await pool.query(
      `UPDATE cart SET quantity=$1 WHERE id=$2 AND user_id=$3 RETURNING *`,
      [quantity, req.params.id, req.user.id],
    );

    if (!update.rows[0]) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Quantity updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const removeItem = async (req, res) => {
  try {
    const del = await pool.query(
      `DELETE FROM cart WHERE id=$1 AND user_id=$2 RETURNING *`,
      [req.params.id, req.user.id],
    );

    if (!del.rows[0]) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUserCart, addItemToCart, updateQuantity, removeItem };
