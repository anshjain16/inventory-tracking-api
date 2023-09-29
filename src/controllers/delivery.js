const dbclient = require("../dbconfig/database");

const createDeliveryMan = async (req, res) => {
  try {
    const manager_id = req.user.user_id;
    const { phone, fullname } = req.body;
    const response = await dbclient.query(
      "INSERT INTO delivery_man(fullname, phone, manager_id) VALUES($1, $2, $3)",
      [fullname, phone, manager_id]
    );
    res.status(200).json("created");
  } catch (error) {
    res.status(500).json("error");
  }
};

const getDeliveryManToManager = async (req, res) => {
  try {
    const manager_id = req.user.user;
    const delivery_men = await dbclient.query(
      "SELET * FROM delivery_man WHERE manager_id = $1",
      [manager_id]
    );
    res.status(200).json(delivery_men.rows);
  } catch (error) {
    res.status(500).json("error");
  }
};

module.exports = { createDeliveryMan, getDeliveryManToManager };
