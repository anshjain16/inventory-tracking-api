const dbclient = require("../dbconfig/database");
const jwt = require("jsonwebtoken");

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

const loginDeliveryMan = async (req, res) => {
  const { fullname, phone } = req.body;
  console.log(req.body);
  dbclient.query(
    "SELECT * FROM delivery_man WHERE phone = $1 AND fullname = $2",
    [phone, fullname],
    (err, response) => {
      if (response.rowCount === 0) {
        res.status(500).json("Enter valid phone");
      } else if (response.rows[0].fullname == fullname) {
        const token = jwt.sign(
          {
            fullname: fullname,
            phone: phone,
            dm_id: response.rows[0].dm_id,
          },
          "thisismysecretkey"
        );
        res.status(200).json({
          access_token: token,
          role: response.rows[0].role,
        });
      } else if (err) {
        res.status(505).json(err);
      } else {
        res.status(400).json("not authorized");
      }
    }
  );
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

const getDeliveryManInfo = async (req, res) => {
  try {
    const dm_id = req.user.dm_id;
    const deliveryMan = await dbclient.query(
      "SELECT * FROM delivery_man WHERE dm_id = $1",
      [dm_id]
    );
    res.status(200).json(deliveryMan.rows[0]);
  } catch (error) {
    res.status(500).json("error");
  }
};

const updateAvailability = async (req, res) => {
  try {
    let dm_id = req.params.dm_id;
    if (dm_id == 0) {
      dm_id = req.user.dm_id;
    }
    console.log(dm_id);
    const { availability } = req.body;
    const res1 = await dbclient.query(
      "UPDATE delivery_man SET available = $1 WHERE dm_id = $2 RETURNING available, dm_id",
      [availability, dm_id]
    );
    // console.log(res1);
    res.status(200).json("updated");
  } catch (error) {
    console.log(error);
    res.status(500).json("err");
  }
};

module.exports = {
  createDeliveryMan,
  loginDeliveryMan,
  getDeliveryManToManager,
  getFreeDeliveryManToManager,
  getDeliveryManInfo,
  updateAvailability,
};
