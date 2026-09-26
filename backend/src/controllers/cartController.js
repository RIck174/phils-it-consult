const pool = require("../db");

const getUserCart = async (req, res) => {
  try {
    const getCart = await pool.query(
      `
            SELECT * FROM cart WHERE user_id=$1`,
      [req.user.id],
    );
    res.json(getCart.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error", err: error.message });
  }
};

const addItemToCart = async (req, res) => {
  try {
    const { quantity, productId } = req.body;
    const addItem = await pool.query(
      `
            INSERT INTO cart(user_id,product_id,quantity)
            VALUES($1,$2,$3)`,
      [req.user.id, productId, quantity],
    );
    res.status(201).json({ message: "Item added to cart" });
  } catch (error) {
    res.status(500).json({ message: "Server error", err: error.message });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const update = await pool.query(
      `
            UPDATE cart SET quantity=$1 WHERE id=$2
            
            RETURNING *`,
      [quantity, req.params.id],
    );
    res.status(201).json({ message: "Quantity updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", err: error.message });
  }
};

const removeItem = async (req, res) => {
  try {
    const del = await pool.query(
      `
            DELETE FROM cart WHERE id =$1`,
      [req.params.id],
    );
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Server error", err: error.message });
  }
};

module.exports = { getUserCart, addItemToCart, updateQuantity, removeItem };
