const express = require("express");
const { authenticate, isAdmin } = require("../middleware/auth");
const {
  createOrder,
  cancelOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");
const router = express.Router();

router.post("/", authenticate, createOrder);
router.delete("/:id", authenticate, cancelOrder);
router.get("/", authenticate, isAdmin, getAllOrders);
router.get("/:id", authenticate, getOrderById);
router.put("/:id", authenticate, isAdmin, updateOrderStatus);

module.exports = router;
