const { Client } = require("pg");
const dbclient = require("./src/dbconfig/database");
const cors = require("cors");
const express = require("express");
require("dotenv").config();

const app = express();
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("updateLocation", (data) => {
    io.to(data[2]).emit("locationUpdate", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("join room", (dm_id) => {
    console.log(dm_id);
    socket.join(dm_id[0]);
  });

  socket.on("leave room", (dm_id) => {
    socket.leave(dm_id[0]);
  });
});

const userRouter = require("./src/routes/user");
const productRouter = require("./src/routes/product");
const categoryRouter = require("./src/routes/category");
const orderRouter = require("./src/routes/order");
const notifRouter = require("./src/routes/notif");
const deliveryRouter = require("./src/routes/delivery");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: "application/vnd.api+json" }));
app.use(cors());

app.use("/api/v1/user/", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/notif", notifRouter);
app.use("/api/v1/delivery", deliveryRouter);

app.get("/", (req, res) => {
  res.status(200).send("working");
});

const port = process.env.PORT || 8080;

server.listen(port, async () => {
  await dbclient.connect();
  console.log(`The server is running on port: ${port}`);
});
