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
const { getVariants, addVariant, updateVariant, deleteVariant } = require("../controllers/variantController");
const { authenticate, isAdmin } = require("../middleware/auth");

router.get(`/`, getAllProducts);
router.get(`/search`, searchProducts);
router.get(`/:id`, getProductById);
router.post(`/`, addProduct);
router.put(`/:id`, updateProduct);
router.delete(`/:id`, deleteProduct);

// Variant routes
router.get(`/:id/variants`, getVariants);
router.post(`/:id/variants`, addVariant);
router.put(`/variants/:variantId`, updateVariant);
router.delete(`/variants/:variantId`, deleteVariant);

module.exports = router;

