const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const { addUsername } = require("../middleware/user-adder");
const {
  addProduct,
  getAllProducts,
  getProduct,
  getProductName,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getCompleteStockProducts,
  getAllProductsByCategory,
} = require("../controllers/product");
router.get("/user/:user_name", addUsername, getAllProducts);

// get whole stock
router.get("/all", getCompleteStockProducts);

// get category wise whole stock
router.get("/all/:category_id", getAllProductsByCategory);

// create product
router.post("/", authMiddleware, addProduct);

// get a product
router.get("/:product_id", authMiddleware, getProduct);

// get product name
router.get("/name/:product_id", getProductName);

// get all products
router.get("/", authMiddleware, getAllProducts);

// update products
router.put("/:product_id", authMiddleware, updateProduct);

// delete product
router.delete("/:product_id", authMiddleware, deleteProduct);

// get products by category
router.get("/categorywise/:category_id", authMiddleware, getProductsByCategory);

module.exports = router;
