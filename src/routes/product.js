const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const {
  addProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} = require("../controllers/product");

// create product
router.post("/", authMiddleware, addProduct);

// get a product
router.get("/:product_id", authMiddleware, getProduct);

// get all products
router.get("/", authMiddleware, getAllProducts);

// update products
router.put("/:product_id", authMiddleware, updateProduct);

// delete product
router.delete("/:product_id", authMiddleware, deleteProduct);

// get products by category
router.get("/categorywise/:category_id", authMiddleware, getProductsByCategory);

module.exports = router;