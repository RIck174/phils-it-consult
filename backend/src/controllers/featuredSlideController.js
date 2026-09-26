const pool = require("../db");

const getFeaturedSlides = async (req, res) => {
  try {
    const slides = await pool.query(`
      SELECT s.id, s.video_url, s.badge, s.display_order,
             p.id AS product_id, p.name, p.brand, p.price, p.description, p.created_at
      FROM featured_slides s
      JOIN products p ON p.id = s.product_id
      ORDER BY s.display_order ASC`);

    res.json(slides.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch featured slides" });
  }
};

const addFeaturedSlide = async (req, res) => {
  try {
    const { product_id, video_url, badge, display_order } = req.body;

    const newSlide = await pool.query(
      `
            INSERT INTO featured_slides (product_id, video_url, badge, display_order)
            VALUES($1,$2,$3,$4)
            RETURNING *`,
      [product_id, video_url, badge, display_order],
    );

    res.status(201).json({
      message: "New featured slide added",
      slide: newSlide.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create featured slide" });
  }
};

const deleteFeaturedSlide = async (req, res) => {
  try {
    await pool.query(
      `
            DELETE FROM featured_slides WHERE id=$1`,
      [req.params.id],
    );

    res.status(200).json({ message: "Featured slide successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete featured slide" });
  }
};

module.exports = { getFeaturedSlides, addFeaturedSlide, deleteFeaturedSlide };
