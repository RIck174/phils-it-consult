const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} = require("../controllers/productController");
const { authenticate, isAdmin } = require("../middleware/auth");

router.get(`/`, getAllProducts);
router.get(`/search`, searchProducts);
router.get(`/:id`, getProductById);
router.post(`/`, authenticate, isAdmin, addProduct);
router.put(`/:id`, authenticate, isAdmin, updateProduct);
router.delete(`/:id`, authenticate, isAdmin, deleteProduct);

module.exports = router;
