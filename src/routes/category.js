const express = require("express");
const { getCategories } = require("../controllers/category");

const router = express.Router();

// get all categories
router.get("/", getCategories);

module.exports = router;
