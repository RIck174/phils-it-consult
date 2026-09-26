const express = require("express");
const {
  getAllServices,
  AddNewService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { authenticate, isAdmin } = require("../middleware/auth");
const router = express.Router();

router.post("/", authenticate, isAdmin, AddNewService);
router.get("/", getAllServices);
router.put("/:id", authenticate, isAdmin, updateService);
router.delete("/:id", authenticate, isAdmin, deleteService);

module.exports = router;
