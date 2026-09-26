const pool = require("../db.js");

const getAllCategories = async (req, res) => {
  try {
    const categories = await pool.query(`
            SELECT * FROM categories`);

    res.json(categories.rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server Error. Failed to fetch categories" });
  }
};

const getCategoryBrands = async (req, res) => {
  try {
    const getBrands = await pool.query(
      `
      SELECT DISTINCT brand from products WHERE category_id=$1`,
      [req.params.id],
    );

    res.json(getBrands.rows);
  } catch (error) {
    res.status(500).json({ message: "Server Error. Failed to fetch brands" });
  }
};

const addNewCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await pool.query(
      `
            INSERT INTO categories (name)
            Values($1)`,
      [name],
    );

    res.status(201).json({ message: "New category created" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server Error. Failed to add new category" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const dCategory = await pool.query(
      `
            DELETE FROM categories WHERE id=$1`,
      [req.params.id],
    );

    res.status(200).json({ message: "Category successfully deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server Error. Failed to delete category" });
  }
};

module.exports = {
  getAllCategories,
  addNewCategory,
  deleteCategory,
  getCategoryBrands,
};
