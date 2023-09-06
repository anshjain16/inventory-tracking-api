const dbclient = require("../dbconfig/database");

const createOrder = async (req, res) => {
  const customer_id = req.user.user_id;
  console.log(req.user);
  dbclient.query(
    "INSERT INTO orders(customer_id, status_id) VALUES($1, 1)",
    [customer_id],
    (err, response) => {
      if (err) {
        console.log(err);
        res.status(500).json("error");
      } else {
        res.status(200).json(response.rows);
      }
    }
  );
};

const updateAmmount = async (req, res) => {
  const total_ammount = req.body;
  const order_id = req.params.order_id;
  dbclient.query(
    "UDPATE orders SET total_ammount = $1 WHERE order_id = $2",
    [total_ammount, order_id],
    (err, response) => {
      if (err) {
        res.status(500).json("error");
      } else {
        res.status(200).json("udpated");
      }
    }
  );
};

const updateStatus = async (req, res) => {
  const status_id = req.body;
  const order_id = req.params.order_id;
  dbclient.query(
    "UDPATE orders SET status_id = $1 WHERE order_id = $2",
    [status_id, order_id],
    (err, response) => {
      if (err) {
        res.status(500).json("error");
      } else {
        res.status(200).json("udpated");
      }
    }
  );
};

const deleteOrder = async (req, res) => {};

const getOrder = async (req, res) => {
  const order_id = req.params.order_id;
  dbclient.query(
    "SELECT * FROM orders WHERE order_id = $1",
    [order_id],
    (err, response) => {
      if (err) {
        console.log(err);
        res.status(500).json("error");
      } else {
        res.status(200).json(response.rows[0]);
      }
    }
  );
};

const getAllOrders = async (req, res) => {};

const createItem = async (req, res) => {
  const product_id = req.params.product_id;
  const { quantity } = req.body;
  const order_id = req.params.order_id;

  dbclient.query(
    "SELECT price FROM products WHERE product_id = $1",
    [product_id],
    (err, response) => {
      const price_per_unit = Number(response.rows[0].price);
      const subtotal = price_per_unit * quantity;
      dbclient.query(
        "INSERT INTO order_items(order_id, product_id, quantity, price_per_unit, subtotal) VALUES($1, $2, $3, $4, $5)",
        [order_id, product_id, quantity, price_per_unit, subtotal],
        (err, response) => {
          if (err) {
            res.status(500).json("error");
            console.log(err);
          } else {
            res.status(200).json("created");
          }
        }
      );
    }
  );
};

const deleteItem = async (req, res) => {
  const item_id = req.params.item_id;
  dbclient.query(
    "DELETE FROM order_items WHERE item_id = $1",
    [item_id],
    (err, response) => {
      if (err) {
        res.status(500).json("error");
      } else {
        res.status(200).json("deleted");
      }
    }
  );
};

const updateItem = async (req, res) => {
  const { quantity } = req.body;
  const item_id = req.params.item_id;
  dbclient.query(
    "SELECT * FROM order_items WHERE item_id = $1",
    [item_id],
    (err, response) => {
      const price_per_unit = Number(response.rows[0].price_per_unit);
      const subtotal = price_per_unit * quantity;
      dbclient.query(
        "UPDATE order_items SET quantity = $1, subtotal = $2 WHERE item_id = $3",
        [quantity, subtotal, item_id],
        (err, response) => {
          if (err) {
            res.status(500).json("error");
          } else {
            res.status(200).json("updated");
          }
        }
      );
    }
  );
};

const getItem = async (req, res) => {
  const item_id = req.params.item_id;
  dbclient.query(
    "SELECT * FROM order_items WHERE item_id = $1",
    [item_id],
    (err, response) => {
      if (err) {
        res.status(500).json("error");
      } else {
        res.status(200).json(response.rows[0]);
      }
    }
  );
};

const getAllItems = async (req, res) => {
  const order_id = req.params.order_id;
  dbclient.query(
    "SELECT * FROM order_items WHERE order_id = $1",
    [order_id],
    (err, response) => {
      if (err) {
        res.status(500).json("error");
      } else {
        res.status(200).json(response.rows);
      }
    }
  );
};

module.exports = {
  createOrder,
  updateAmmount,
  updateStatus,
  deleteOrder,
  getOrder,
  getAllOrders,
  createItem,
  updateItem,
  deleteItem,
  getItem,
  getAllItems,
};
