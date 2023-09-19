const dbclient = require("../dbconfig/database");
const PDFDocument = require("pdfkit");

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

      // Loop through products in the order and add them to the PDF
      // items.forEach((item) => {
      //   doc.text(
      //     `${item.product_id}: $${item.price_per_unit} x ${item.quantity}`
      //   );
      // });
      // const table = {
      //   headers: ["Product Name", "Price", "Quantity", "Total"],
      //   rows: [],
      // };
      // // Loop through products in the order and add them to the table
      // products.forEach((product) => {
      //   const total = product.price_per_unit * product.quantity;
      //   table.rows.push([
      //     product.product_name,
      //     `$${product.price_per_unit}`,
      //     product.quantity,
      //     `$${total}`,
      //   ]);
      // });
      // Add the table to the PDF
      // doc.table(table, {
      //   prepareHeader: () => doc.fontSize(12),
      //   prepareRow: (row, i) =>
      //     doc.fontSize(10).text(row.join("  "), { width: 410, align: "left" }),
      // });
      const columnWidths = [200, 100, 80, 100];

      // Draw the table header
      doc
        .font("Helvetica-Bold")
        .text(table.headers.join("  "), { columns: columnWidths });

      // Draw each row
      doc.font("Helvetica").text("", { columns: columnWidths }); // Add a blank line to separate header and rows
      table.rows.forEach((row) => {
        doc.text(row.join("  "), { columns: columnWidths });
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
