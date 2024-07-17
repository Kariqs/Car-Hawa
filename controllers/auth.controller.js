const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const utils = require("../utils/email");

exports.getSignup = (req, res) => {
  let messages = req.flash("loginError");
  const errorMessage = messages.length > 0 ? messages[0] : null;
  res.render("auth/Signup", { errorMessage });
};

exports.postSignup = (req, res) => {
  const { email, name, phone, username, location, password, confirmPassword } =
    req.body;
  User.findOne({ email: email }).then((u) => {
    if (u) {
      req.flash(
        "loginError",
        "User with this email already exists, please use a different email or login to continue."
      );
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
        utils.signUpEmail(email, u.name);
      });
    });
  });
};

exports.getLogin = (req, res) => {
  let messages = req.flash("loginError");
  const errorMessage = messages.length > 0 ? messages[0] : null;
  res.render("auth/Login", { errorMessage });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }).then((u) => {
    if (!u) {
      req.flash(
        "loginError",
        "User with this email does not exist. Create account to continue."
      );
      return res.redirect("/login");
    }
    return bcryptjs.compare(password, u.password).then((result) => {
      if (!result) {
        req.flash("loginError", "Wrong password! Try again.");
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
