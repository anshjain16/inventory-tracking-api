const dbclient = require("../dbconfig/database");

const getCategories = async (req, res) => {
  dbclient.query("SELECT * FROM categories", (err, response) => {
    res.status(200).json(response.rows);
  });
};

module.exports = { getCategories };
