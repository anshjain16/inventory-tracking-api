// --database client to identify the databse--
const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: "5432",
  password: "Anshjain123@",
  database: "inventory tracking",
});

// --trial for connection--

// client.connect();

// client.query("SELECT * FROM courses", (err, res) => {
//   if (!err) {
//     console.log(res.rows);
//   } else {
//     console.log(err);
//   }
//   client.end;
// });

module.exports = client;
