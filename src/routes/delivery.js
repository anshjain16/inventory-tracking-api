const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  createDeliveryMan,
  getDeliveryManToManager,
} = require("../controllers/delivery");

const router = express.Router();

// create delivery man
router.post("/", authMiddleware, createDeliveryMan);

// get list of delivery mans for a specific manager
router.get("/manager", authMiddleware, getDeliveryManToManager);

// update delivery man
router.put("/:dm_id", authMiddleware, updateDeliveryMan);

// delete delivery man
router.delete("/:dm_id", authMiddleware, deleteDeliveryMan);
