const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  createDeliveryMan,
  getDeliveryManToManager,
  getFreeDeliveryManToManager,
  loginDeliveryMan,
  updateAvailability,
} = require("../controllers/delivery");

const router = express.Router();

// create delivery man
router.post("/", authMiddleware, createDeliveryMan);

// login delivery man
router.post("/login", loginDeliveryMan);

// get list of delivery mans for a specific manager
router.get("/manager", authMiddleware, getDeliveryManToManager);
router.get("/manager/free", authMiddleware, getFreeDeliveryManToManager);

// update delivery man
router.put("/availability/:dm_id", authMiddleware, updateAvailability);

// delete delivery man
// router.delete("/:dm_id", authMiddleware, deleteDeliveryMan);

module.exports = router;
