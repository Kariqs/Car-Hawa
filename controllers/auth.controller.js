const bcryptjs = require("bcryptjs");
const User = require("../models/user");

exports.getSignup = (req, res) => {
  res.render("auth/Signup");
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
  res.render("auth/Login");
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }).then((u) => {
    if (!u) {
      return res.redirect("/login");
    }
    return bcryptjs.compare(password, u.password).then((result) => {
      if (!result) {
        return res.redirect("/login");
      }
      req.session.isLoggedIn = true;
      req.session.user = u;
      return req.session.save((err) => {
        if (err) {
          return console.log("Error! Could not save session.");
        }
        res.redirect("/");
      });
    });
  });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
