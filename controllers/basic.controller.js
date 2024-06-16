exports.getHome = (req, res) => {
  res.render("Homepage");
};

exports.getSignup = (req, res) => {
  res.render("Signup");
};
exports.getLogin = (req, res) => {
  res.render("Login");
};
