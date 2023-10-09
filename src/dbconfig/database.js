// --database client to identify the databse--
const { Client } = require("pg");

// const database_url =
//   "postgresql://ansh:zNFgyzxsOkkcZkTte9ROyw@my-cluster-6144.8nk.cockroachlabs.cloud:26257/inventory tracking final?sslmode=verify-full";

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: "5432",
  password: "Anshjain123@",
  database: "inventory tracking",
});

// const client = new Client(database_url);

module.exports = client;
