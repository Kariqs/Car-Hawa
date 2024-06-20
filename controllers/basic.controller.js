const User = require("../models/user");
exports.getHome = (req, res) => {
  res.render("Homepage");
};

exports.getSignup = (req, res) => {
  res.render("Signup");
};

exports.postSignup = (req, res) => {
  const { email, name, username, location, password, confirmPassword } =
    req.body;
  const user = new User({
    email: email,
    name: name,
    username: username,
    location: location,
    password: password,
  });
  user
    .save()
    .then((u) => {
      console.log("User has been created.");
      res.redirect("/");
    })
    .catch((err) => {
      console.log("Error creating user:" + error);
    });
};

exports.getLogin = (req, res) => {
  res.render("Login");
};
