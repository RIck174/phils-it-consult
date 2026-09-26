const express = require("express");
const { authenticate, isAdmin } = require("../middleware/auth");
const {
  submitRequest,
  getAllRequest,
  updateRequestStatus,
} = require("../controllers/serviceRequestController");
const router = express.Router();

router.post("/", submitRequest);
router.get("/", authenticate, isAdmin, getAllRequest);
router.put("/:id", authenticate, isAdmin, updateRequestStatus);

module.exports = router;
