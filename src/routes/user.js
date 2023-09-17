const express = require("express");
const router = express.Router();

const {
  registerUser,
  getUser,
  getUserById,
  getUserMid,
  loginUser,
  getManagers,
} = require("../controllers/user");
const { authMiddleware } = require("../middleware/auth");
router.get("/managers", getManagers);

// register a user
router.post("/register", registerUser);

// get a user
router.get("/:user_name", getUser);
router.get("/id/:user_id", getUserById);
router.get("/mid/user", authMiddleware, getUserMid);

// login a user
router.post("/login", loginUser);

// get managers

// update a user

// delete a user

module.exports = router;
