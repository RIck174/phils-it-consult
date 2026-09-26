const express = require("express");
const {
  getUserCart,
  addItemToCart,
  updateQuantity,
  removeItem,
} = require("../controllers/cartController");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

router.post(`/`, authenticate, addItemToCart);
router.get(`/`, authenticate, getUserCart);
router.put(`/:id`, authenticate, updateQuantity);
router.delete(`/:id`, authenticate, removeItem);

module.exports = router;
