const dbclient = require("../dbconfig/database");

const getNotifications = async (req, res) => {
  const user_id = req.user.user_id;
  const response = await dbclient.query(
    "SELECT * FROM notifications WHERE user_id = $1 ORDER BY notification_id DESC",
    [user_id]
  );
  res.status(200).json(response.rows);
};

module.exports = { getNotifications };
