const dbclient = require("../dbconfig/database");

const getCategories = async (req, res) => {
  dbclient.query("SELECT * FROM categories", (err, response) => {
    res.status(200).json(response.rows);
  });
};

const createCategory = async (req, res) => {
  try {
    const { category_name } = req.body;
    const query = await dbclient.query(
      "INSERT INTO categories(category_name) VALUES($1)",
      [category_name]
    );
    res.status(200).json("created category");
  } catch (error) {
    res.status(500).json("error");
  }
};

module.exports = { getCategories, createCategory };
