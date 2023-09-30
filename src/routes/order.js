const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const { checkdb, checkStatus } = require("../middleware/order-util");
const {
  createOrder,
  updateAmmount,
  updateStatus,
  updateDeliveryMan,
  deleteOrder,
  getOrdersOfCustomer,
  getOrdersToManager,
  getOrdersOfCustomerStatusWise,
  getOrdersToManagerStatusWise,
  getOrder,
  createItem,
  updateItem,
  deleteItem,
  getAllItems,
  getItem,
  generateInvoice,
} = require("../controllers/order");

const router = express.Router();

// create order
router.post("/order", authMiddleware, createOrder);

// update order
router.put("/order/status/:order_id", updateStatus);
router.put("/order/ammount/:order_id", checkStatus, updateAmmount);
router.put("/order/delivery/:order_id", updateDeliveryMan);

// delete order
router.delete("/order", deleteOrder);

// get all orders to/of a user
router.get("/order/customer", authMiddleware, getOrdersOfCustomer);
router.get("/order/manager", authMiddleware, getOrdersToManager);

// get orders to/of user status wise
router.get(
  "/order/customer/:status_id",
  authMiddleware,
  getOrdersOfCustomerStatusWise
);
router.get(
  "/order/manager/:status_id",
  authMiddleware,
  getOrdersToManagerStatusWise
);

// get a order
router.get("/order/:order_id", checkStatus, getOrder);

// generate invoice
router.get("/order/invoice/:order_id", generateInvoice);

// create order item
router.post("/item/:order_id/:product_id", checkdb, createItem);

// delete order item
router.delete("/item/:item_id", deleteItem);

// update order item
router.put("/item/:item_id", updateItem);

// get order items for a specific order
router.get("/item/all/:order_id", getAllItems);

// get order item
router.get("/item/:item_id", getItem);

module.exports = router;
