const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const { getNotifications } = require("../controllers/notif");

// get notifications to a user
router.get("/notifications", authMiddleware, getNotifications);

module.exports = router;
