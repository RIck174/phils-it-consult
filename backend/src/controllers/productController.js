const pool = require("../db.js");

const getAllProducts = async (req, res) => {
  try {
    const products = await pool.query(`SELECT * FROM products`);
    res.json(products.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = await pool.query(`SELECT * FROM products WHERE id=$1`, [
      req.params.id,
    ]);

    if (!productId.rows[0]) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(productId.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      brand,
      stock_quantity,
      image_url,
      category_id,
      is_featured,
    } = req.body;

    const newProduct = await pool.query(
      `INSERT INTO products(name, description, price, brand, stock_quantity, image_url, category_id, is_featured)
       Values($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [
        name,
        description,
        price,
        brand,
        stock_quantity,
        image_url,
        category_id,
        is_featured,
      ],
    );

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, Failed to add product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      brand,
      stock_quantity,
      image_url,
      category_id,
      is_featured,
    } = req.body;

    const update = await pool.query(
      `UPDATE products SET name=$1, description=$2, price=$3, brand=$4,
       stock_quantity=$5, image_url=$6, category_id=$7, is_featured=$8
       WHERE id=$9
       RETURNING *`,
      [
        name,
        description,
        price,
        brand,
        stock_quantity,
        image_url,
        category_id,
        is_featured,
        req.params.id,
      ],
    );

    if (!update.rows[0]) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, Failed to update product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleted = await pool.query(
      `DELETE FROM products WHERE id=$1 RETURNING *`,
      [req.params.id],
    );

    if (!deleted.rows[0]) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, Failed to delete product" });
  }
};

const searchProducts = async (req, res) => {
  try {
    const search = await pool.query(
      `SELECT * FROM products WHERE
       name ILIKE $1 OR brand ILIKE $1 OR description ILIKE $1`,
      [`%${req.query.q}%`],
    );
    res.json(search.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
};
