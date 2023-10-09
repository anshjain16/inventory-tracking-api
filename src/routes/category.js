const express = require("express");
const { getCategories, createCategory } = require("../controllers/category");

const router = express.Router();

// get all categories
router.get("/", getCategories);

// create a category
router.post("/", createCategory);

module.exports = router;
