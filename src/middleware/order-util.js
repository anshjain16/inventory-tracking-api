const dbclient = require("../dbconfig/database");

const checkdb = async (req, res, next) => {
  const product_id = req.params.product_id;
  const requestedQuantity = req.body.quantity;
  dbclient.query(
    "SELECT quantity FROM products WHERE product_id = $1",
    [product_id],
    (err, response) => {
      if (err) {
        res.status(500).send("error");
      } else {
        const availableQuantity = response.rows[0].quantity;
        if (requestedQuantity <= availableQuantity) {
          req.body.flag = "1";
          const remainingQuantity = availableQuantity - requestedQuantity;
          dbclient.query(
            "UPDATE products SET quantity = $1 WHERE product_id = $2",
            [remainingQuantity, product_id],
            (err, response) => {
              if (err) {
                console.log(err);
              } else {
              }
            }
          );
        } else {
          req.body.flag = "0";
        }
        next();
      }
    }
  );
};

const checkStatus = async (req, res, next) => {
  const order_id = req.params.order_id;
  dbclient.query(
    "SELECT * FROM order_items WHERE order_id = $1",
    [order_id],
    (err, response) => {
      if (err) {
        res.status(500).json("error");
      } else {
        const items = response.rows;
        let isReady = true;
        items.map((item) => {
          isReady = isReady && item.ready_flag;
        });
        if (isReady == true) {
          dbclient.query(
            "UPDATE orders SET status_id = 2 WHERE order_id = $1",
            [order_id],
            (err, response) => {
              if (err) {
                res.status(500).json("error");
              } else {
                // next();
              }
            }
          );
        }
        next();
      }
    }
  );
};

const updateItemFlag = async (req, res, next) => {
  const product_id = req.params.product_id;
  let availableQuantity = req.body.quantity;
  dbclient.query(
    "SELECT * FROM order_items WHERE product_id = $1 AND ready_flag = false ORDER BY order_id ASC",
    [product_id],
    (err, response) => {
      if (err) {
        console.log(err);
      }
      const items = response.rows;
      items.map((item) => {
        if (availableQuantity >= item.quantity) {
          availableQuantity = availableQuantity - item.quantity;
          dbclient.query(
            "UPDATE order_items SET ready_flag = true WHERE item_id = $1",
            [item.item_id],
            (err, response) => {
              if (err) {
                console.log(err);
              } else {
              }
            }
          );
        }
      });
      req.body.quantity = availableQuantity;
      next();
    }
  );
};

module.exports = { checkdb, checkStatus, updateItemFlag };
