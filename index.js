const { Client } = require("pg");
const dbclient = require("./src/dbconfig/database");

// dbclient.connect();

// dbclient.query("SELECT * FROM products", (err, res) => {
//   if (!err) {
//     console.log(res);
//   } else {
//     console.log(err);
//   }
//   dbclient.end;
// });

const express = require("express");
const cors = require("cors");
const userRouter = require("./src/routes/user");
const productRouter = require("./src/routes/product");
const categoryRouter = require("./src/routes/category");
const orderRouter = require("./src/routes/order");
const notifRouter = require("./src/routes/notif");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: "application/vnd.api+json" }));
app.use(cors());

app.use("/api/v1/user/", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/notif", notifRouter);

// const port = PROCESS.ENV.PORT || 8080;

app.listen(8080, () => {
  dbclient.connect();
  console.log("The server is running on port: 8080");
});
