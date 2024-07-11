const bcryptjs = require("bcryptjs");
const User = require("../models/user");

exports.getSignup = (req, res) => {
  res.render("Signup");
};

exports.postSignup = (req, res) => {
  const { email, name, phone, username, location, password, confirmPassword } =
    req.body;
  User.findOne({ email: email }).then((u) => {
    if (u) {
      return res.redirect("/signup");
    }
    return bcryptjs.hash(password, 15).then((hashedPassword) => {
      const user = new User({
        email: email,
        name: name,
        phone: phone,
        username: username,
        location: location,
        password: hashedPassword,
        cart: { items: [] },
      });
      user.save().then((u) => {
        res.redirect("/login");
      });
    });
  });
};

exports.getLogin = (req, res) => {
  res.render("Login");
};
