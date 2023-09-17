const addUsername = async (req, res, next) => {
  const user_name = req.params.user_name;
  // console.log(user_name);
  req.user = { user_name: user_name };
  next();
};

module.exports = {
  addUsername,
};
