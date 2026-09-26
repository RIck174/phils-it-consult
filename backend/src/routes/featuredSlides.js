const express = require("express");
const { authenticate, isAdmin } = require("../middleware/auth");
const {
  getFeaturedSlides,
  addFeaturedSlide,
  deleteFeaturedSlide,
} = require("../controllers/featuredSlideController");
const router = express.Router();

router.get("/", getFeaturedSlides);
router.post("/", authenticate, isAdmin, addFeaturedSlide);
router.delete("/:id", authenticate, isAdmin, deleteFeaturedSlide);

module.exports = router;
