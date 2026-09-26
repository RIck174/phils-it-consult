const express = require("express");
const router = express.Router();
const { authenticate, isAdmin } = require("../middleware/auth.js");
const {
  getAllCategories,
  addNewCategory,
  deleteCategory,
  getCategoryBrands,
} = require("../controllers/categoryController.js");

router.get("/", getAllCategories);
router.get("/:id/brands", getCategoryBrands);
router.post("/", authenticate, isAdmin, addNewCategory);
router.delete("/:id", authenticate, isAdmin, deleteCategory);

module.exports = router;
