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
            "UPDATE products SET quantity = $1 WHERE product_id = $2 RETURNING *",
            [remainingQuantity, product_id],
            (err, response) => {
              if (err) {
                console.log(err);
              } else {
                const threshold = response.rows[0].threshhold;
                const manager_id = response.rows[0].manager_id;
                // console.log(remainingQuantity, threshold);
                const content = `The product ${response.rows[0].product_name} is in low stock`;
                if (remainingQuantity < threshold) {
                  console.log(threshold, manager_id, content);
                  dbclient.query(
                    "INSERT INTO notifications(user_id, content) VALUES($1, $2)",
                    [manager_id, content],
                    (err, response) => {
                      if (err) {
                        console.log(err);
                      } else {
                      }
                    }
                  );
                }
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

  const order = await dbclient.query(
    "SELECT * FROM orders WHERE order_id = $1",
    [order_id]
  );

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
        if (isReady == true && order.rows[0].status_id == 1) {
          dbclient.query(
            "UPDATE orders SET status_id = 2 WHERE order_id = $1 RETURNING *",
            [order_id],
            (err, response) => {
              if (err) {
                res.status(500).json("error");
              } else {
                const customer_id = response.rows[0].customer_id;
                const content = `Order-${order_id} has been placed`;
                dbclient.query(
                  "INSERT INTO notifications(user_id, content) VALUES($1, $2)",
                  [customer_id, content],
                  (err, response) => {
                    if (err) {
                      console.log(err);
                    } else {
                    }
                  }
                );
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
  let order_list = [];
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
          order_list.push(item.order_id);
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
      console.log(availableQuantity);
      console.log(order_list);
      req.body.quantity = availableQuantity;
      req.body.order_list = order_list;
      next();
    }
  );
};

const checkStatusWhileUpdateProduct = async (req, res, next) => {
  const order_list = req.body.order_list;
  console.log(order_list);

  order_list.map(async (order_id) => {
    const order = await dbclient.query(
      "SELECT * FROM orders WHERE order_id = $1",
      [order_id]
    );

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
          if (isReady == true && order.rows[0].status_id == 1) {
            dbclient.query(
              "UPDATE orders SET status_id = 2 WHERE order_id = $1 RETURNING *",
              [order_id],
              (err, response) => {
                if (err) {
                  res.status(500).json("error");
                } else {
                  const customer_id = response.rows[0].customer_id;
                  const content = `Order-${order_id} has been placed`;
                  dbclient.query(
                    "INSERT INTO notifications(user_id, content) VALUES($1, $2)",
                    [customer_id, content],
                    (err, response) => {
                      if (err) {
                        console.log(err);
                      } else {
                      }
                    }
                  );
                }
              }
            );
          }
        }
      }
    );
  });
  next();
};

module.exports = {
  checkdb,
  checkStatus,
  updateItemFlag,
  checkStatusWhileUpdateProduct,
};
