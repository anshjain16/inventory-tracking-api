const dbclient = require("../dbconfig/database");

const createDeliveryMan = async (req, res) => {
  try {
    const res1 = await dbclient.query("SELECT COUNT(*) FROM delivery_man");
    const dm_id = 1 + Number(res1.rows[0].count);

    const manager_id = req.user.user_id;
    const { phone, fullname } = req.body;
    const response = await dbclient.query(
      "INSERT INTO delivery_man(dm_id, fullname, phone, manager_id) VALUES($1, $2, $3, $4)",
      [dm_id, fullname, phone, manager_id]
    );
    res.status(200).json("created");
  } catch (error) {
    console.log(error);
    res.status(500).json("error");
  }
};

const getDeliveryManToManager = async (req, res) => {
  try {
    const manager_id = req.user.user_id;
    const delivery_men = await dbclient.query(
      "SELECT * FROM delivery_man WHERE manager_id = $1",
      [manager_id]
    );
    res.status(200).json(delivery_men.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json("error");
  }
};

const getFreeDeliveryManToManager = async (req, res) => {
  try {
    const manager_id = req.user.user_id;
    const delivery_men = await dbclient.query(
      "SELECT * FROM delivery_man WHERE manager_id = $1 AND available = true",
      [manager_id]
    );
    res.status(200).json(delivery_men.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json("error");
  }
};

const updateAvailability = async (req, res) => {
  try {
    const dm_id = req.params.dm_id;
    const { availability } = req.body;
    const res1 = await dbclient.query(
      "UPDATE delivery_man SET available = $1 WHERE dm_id = $2",
      [availability, dm_id]
    );
    res.status(200).json("updated");
  } catch (error) {}
};

module.exports = {
  createDeliveryMan,
  getDeliveryManToManager,
  getFreeDeliveryManToManager,
  updateAvailability,
};
