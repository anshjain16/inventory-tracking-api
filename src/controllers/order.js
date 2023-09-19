const dbclient = require("../dbconfig/database");
const PDFDocument = require("pdfkit");

const createOrder = async (req, res) => {
  const customer_id = req.user.user_id;
  const { manager_name } = req.body;
  dbclient.query(
    "SELECT * FROM users WHERE user_name = $1",
    [manager_name],
    (err, response) => {
      const manager_id = response.rows[0].user_id;
      dbclient.query(
        "INSERT INTO orders(customer_id, status_id, manager_id) VALUES($1, 1, $2) RETURNING *",
        [customer_id, manager_id],
        (err, response) => {
          if (err) {
            console.log(err);
            res.status(500).json("error");
          } else {
            res.status(200).json(response.rows);
          }
        }
      );
    }
  );
};

const updateAmmount = async (req, res) => {
  const { total_ammount } = req.body;
  const order_id = req.params.order_id;
  dbclient.query(
    "UPDATE orders SET total_ammount = $1 WHERE order_id = $2",
    [total_ammount, order_id],
    (err, response) => {
      if (err) {
        console.log(err);
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

const getAllOrders = async (req, res) => {
  const user_id = req.user.user_id;
  dbclient.query(
    "SELECT * FROM orders WHERE customer_id = $1 ORDER BY order_id DESC",
    [user_id],
    (err, response) => {
      if (err) {
        res.status(500).json("error");
      } else {
        res.status(200).json(response.rows);
      }
    }
  );
};

const createItem = async (req, res) => {
  const product_id = req.params.product_id;
  console.log(req.body);
  const { quantity, flag } = req.body;
  const order_id = req.params.order_id;

  dbclient.query(
    "SELECT price FROM products WHERE product_id = $1",
    [product_id],
    (err, response) => {
      const price_per_unit = Number(response.rows[0].price);
      const subtotal = price_per_unit * quantity;
      dbclient.query(
        "INSERT INTO order_items(order_id, product_id, quantity, price_per_unit, subtotal, ready_flag) VALUES($1, $2, $3, $4, $5, $6)",
        [order_id, product_id, quantity, price_per_unit, subtotal, flag],
        (err, response) => {
          if (err) {
            res.status(500).json("error");
            console.log(err);
          } else {
            res.status(200).json(subtotal);
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

const generateInvoice = async (req, res) => {
  try {
    // Fetch order details and products from the database based on orderId
    const order_id = req.params.order_id;

    const result = await dbclient.query(
      "SELECT * FROM orders WHERE order_id = $1",
      [order_id]
    );
    const order = result.rows[0];
    // res.json(order);

    const result2 = await dbclient.query(
      "SELECT * FROM order_items WHERE order_id = $1",
      [order_id]
    );
    let items = result2.rows;

    const result3 = await dbclient.query(
      "SELECT * FROM users WHERE user_id = $1",
      [order.manager_id]
    );
    const manager_name = result3.rows[0].fullname;

    let products = [];
    const promises = items.map(async (item) => {
      const result4 = await dbclient.query(
        "SELECT * FROM products WHERE product_id = $1",
        [item.product_id]
      );
      products.push({ ...item, product_name: result4.rows[0].product_name });
      // console.log(result4);
      return { ...item, product_name: result4.rows[0].product_name };
    });

    Promise.all(promises).then((products) => {
      const doc = new PDFDocument();
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="invoice-${order_id}.pdf"`
      );
      res.setHeader("Content-Type", "application/pdf");
      doc.pipe(res);

      // Add content to the PDF (customize this based on your order structure)
      doc.fontSize(18).text("Invoice", { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text(`Order ID: ${order.order_id}`);
      doc.moveDown();
      doc.fontSize(12).text("Order Details:");
      doc.moveDown();

      doc.font("Helvetica-Bold");
      doc.text("Product Name", 50, doc.y, { width: 200 });
      doc.text("Price", 250, doc.y, { width: 100 });
      doc.text("Quantity", 350, doc.y, { width: 80 });
      doc.text("Total", 450, doc.y, { width: 100 });
      doc.y += 20; // Move down after header

      // Loop through products in the order and add them to the "table"
      doc.font("Helvetica");
      products.forEach((product) => {
        const total = product.price_per_unit * product.quantity;
        doc.text(product.product_name, 50, doc.y, { width: 200 });
        doc.text(`$${product.price_per_unit}`, 250, doc.y, { width: 100 });
        doc.text(product.quantity.toString(), 350, doc.y, { width: 80 });
        doc.text(`$${total}`, 450, doc.y, { width: 100 });
        doc.y += 20; // Move down after each row
      });

      doc.moveDown();
      doc.fontSize(14).text(`Total Amount: $${order.total_ammount}`);
      doc.end(); // End the document
    });

    // res.json({ order, manager_name, items , resu});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate invoice" });
  }
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
  generateInvoice,
};
