const pool = require("../db.js");

// GET /api/products/:id/variants
const getVariants = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM product_variants WHERE product_id = $1 ORDER BY id ASC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error getting variants:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/products/:id/variants
const addVariant = async (req, res) => {
  try {
    const { label, color_hex, image_url, price, stock_quantity } = req.body;
    if (!label || !label.trim()) {
      return res.status(400).json({ message: "Variant label is required" });
    }

    const cleanPrice = price !== "" && price !== undefined && price !== null ? parseFloat(price) : null;
    const cleanStock = stock_quantity !== "" && stock_quantity !== undefined && stock_quantity !== null ? parseInt(stock_quantity, 10) : 0;
    const cleanHex = color_hex && color_hex.trim() !== "" ? color_hex.trim() : null;
    const cleanImg = image_url && image_url.trim() !== "" ? image_url.trim() : null;

    const result = await pool.query(
      `INSERT INTO product_variants (product_id, label, color_hex, image_url, price, stock_quantity)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        req.params.id,
        label.trim(),
        cleanHex,
        cleanImg,
        cleanPrice,
        isNaN(cleanStock) ? 0 : cleanStock
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding variant:", err);
    res.status(500).json({ message: "Failed to add variant: " + err.message });
  }
};

// PUT /api/products/variants/:variantId
const updateVariant = async (req, res) => {
  try {
    const { label, color_hex, image_url, price, stock_quantity } = req.body;
    if (!label || !label.trim()) {
      return res.status(400).json({ message: "Variant label is required" });
    }

    const cleanPrice = price !== "" && price !== undefined && price !== null ? parseFloat(price) : null;
    const cleanStock = stock_quantity !== "" && stock_quantity !== undefined && stock_quantity !== null ? parseInt(stock_quantity, 10) : 0;
    const cleanHex = color_hex && color_hex.trim() !== "" ? color_hex.trim() : null;
    const cleanImg = image_url && image_url.trim() !== "" ? image_url.trim() : null;

    const result = await pool.query(
      `UPDATE product_variants
       SET label=$1, color_hex=$2, image_url=$3, price=$4, stock_quantity=$5
       WHERE id=$6 RETURNING *`,
      [
        label.trim(),
        cleanHex,
        cleanImg,
        cleanPrice,
        isNaN(cleanStock) ? 0 : cleanStock,
        req.params.variantId
      ]
    );
    if (!result.rows[0]) return res.status(404).json({ message: "Variant not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating variant:", err);
    res.status(500).json({ message: "Failed to update variant: " + err.message });
  }
};

// DELETE /api/products/variants/:variantId
const deleteVariant = async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM product_variants WHERE id=$1 RETURNING *`,
      [req.params.variantId]
    );
    if (!result.rows[0]) return res.status(404).json({ message: "Variant not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error deleting variant:", err);
    res.status(500).json({ message: "Failed to delete variant: " + err.message });
  }
};

module.exports = { getVariants, addVariant, updateVariant, deleteVariant };
