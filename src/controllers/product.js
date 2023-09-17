const dbclient = require("../dbconfig/database");

const addProduct = async (req, res) => {
  const { product_name, description, price, quantity, threshold, category_id } =
    req.body;
  const user_name = req.user.user_name;

  dbclient.query(
    "SELECT * FROM users WHERE user_name = $1",

    [user_name],

    (err, response) => {
      rows = response.rows;
      const manager_id = rows[0].user_id;

      dbclient.query(
        "INSERT INTO products(product_name, description, price, quantity, category_id, manager_id, threshhold) VALUES ($1, $2, $3, $4, $7, $5, $6);",

        [
          product_name,
          description,
          price,
          quantity,
          manager_id,
          threshold,
          category_id,
        ],

        (err, response) => {
          console.log(err);
          res.status(200).send(response.rows);
        }
      );
    }
  );

  //   res.send("something");
};

const getAllProducts = async (req, res) => {
  // console.log(req.user);
  const user_name = req.user.user_name;

  dbclient.query(
    "SELECT * FROM users WHERE user_name = $1",

    [user_name],

    (err, response) => {
      //   console.log(err);
      rows = response.rows;
      const manager_id = rows[0].user_id;
      dbclient.query(
        "SELECT * FROM products WHERE manager_id = $1",
        [manager_id],
        (err, response) => {
          res.status(200).json(response.rows);
        }
      );
    }
  );
};

const getProduct = async (req, res) => {
  const user_name = req.user.user_name;
  const product_id = req.params.product_id;

  dbclient.query(
    "SELECT * FROM users WHERE user_name = $1",

    [user_name],

    (err, response) => {
      const user_id = response.rows[0].user_id;

      dbclient.query(
        "SELECT * FROM products WHERE product_id = $1",

        [product_id],

        (err, response) => {
          if (response.rows[0].manager_id != user_id) {
            res.status(400).send("you are not authoirzed for this product");
          } else {
            dbclient.query(
              "SELECT * FROM products WHERE product_id = $1",

              [product_id],

              (err, response) => {
                if (err) {
                  console.log(err);
                  res.status(400).send("some error occured");
                } else {
                  res.status(200).json(response.rows[0]);
                }
              }
            );
          }
        }
      );
    }
  );
};

const getProductName = async (req, res) => {
  const product_id = req.params.product_id;
  dbclient.query(
    "SELECT product_name FROM products WHERE product_id = $1",
    [product_id],
    (err, response) => {
      if (err) {
        res.status(500).json("error");
      } else {
        res.status(200).json(response.rows[0].product_name);
      }
    }
  );
};

const updateProduct = async (req, res) => {
  const user_name = req.user.user_name;
  const product_id = req.params.product_id;

  dbclient.query(
    "SELECT * FROM users WHERE user_name = $1",

    [user_name],

    (err, response) => {
      const user_id = response.rows[0].user_id;

      dbclient.query(
        "SELECT * FROM products WHERE product_id = $1",

        [product_id],

        (err, response) => {
          if (response.rows[0].manager_id != user_id) {
            res.status(400).send("you are not authoirzed for this product");
          }
        }
      );
    }
  );

  const { product_name, description, price, quantity, threshold, category_id } =
    req.body;

  dbclient.query(
    "UPDATE products SET product_name = $1, description = $2, price = $3, quantity = $4, threshhold = $5, updated_at = CURRENT_TIMESTAMP, category_id = $7 WHERE product_id = $6",

    [
      product_name,
      description,
      price,
      quantity,
      threshold,
      product_id,
      category_id,
    ],

    (err, response) => {
      if (err) {
        console.log(err);
        res.status(400).send("some error occured");
      } else {
        res.status(200).send("updated");
      }
    }
  );
};

const deleteProduct = async (req, res) => {
  const user_name = req.user.user_name;
  const product_id = req.params.product_id;

  dbclient.query(
    "SELECT * FROM users WHERE user_name = $1",

    [user_name],

    (err, response) => {
      const user_id = response.rows[0].user_id;

      dbclient.query(
        "SELECT * FROM products WHERE product_id = $1",

        [product_id],

        (err, response) => {
          if (response.rows[0].manager_id != user_id) {
            res.status(400).send("you are not authoirzed for this product");
          } else {
            dbclient.query(
              "DELETE FROM products WHERE product_id = $1",

              [product_id],

              (err, response) => {
                if (err) {
                  console.log(err);
                  res.status(400).send("some error occured");
                } else {
                  res.status(200).send("deleted");
                }
              }
            );
          }
        }
      );
    }
  );
};

const getProductsByCategory = async (req, res) => {
  const user_name = req.user.user_name;
  const category_id = req.params.category_id;

  dbclient.query(
    "SELECT * FROM users WHERE user_name = $1",

    [user_name],

    (err, response) => {
      //   console.log(err);
      rows = response.rows;
      const manager_id = rows[0].user_id;
      dbclient.query(
        "SELECT * FROM products WHERE manager_id = $1 AND category_id = $2",
        [manager_id, category_id],
        (err, response) => {
          res.status(200).send(response.rows);
        }
      );
    }
  );
};

const getCompleteStockProducts = async (req, res) => {
  dbclient.query("SELECT * FROM products", (err, response) => {
    if (err) {
      res.status(500).json("error occured");
    } else {
      res.status(200).json(response.rows);
    }
  });
};

const getAllProductsByCategory = async (req, res) => {
  const category_id = req.params.category_id;
  dbclient.query(
    "SELECT * FROM products WHERE category_id = $1",
    [category_id],
    (err, response) => {
      if (err) {
        res.status(500).json("Error occured");
      } else {
        res.status(200).json(response.rows);
      }
    }
  );
};

module.exports = {
  addProduct,
  getAllProducts,
  getProduct,
  getProductName,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getCompleteStockProducts,
  getAllProductsByCategory,
};
