const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const utils = require("../utils/email");
const crypto = require("crypto");

exports.getSignup = (req, res) => {
  let messages = req.flash("error");
  const error = messages.length > 0 ? messages[0] : null;
  res.render("auth/Signup", { error });
};

exports.postSignup = (req, res) => {
  const { email, name, phone, username, location, password, confirmPassword } =
    req.body;
  User.findOne({ email: email }).then((u) => {
    if (u) {
      req.flash(
        "error",
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
        utils.signUpEmail(
          email,
          u.name,
          "You have successfully created an account with us.",
          "ACCOUNT CREATED SUCCESSFULLY",
          null
        );
      });
    });
  });
};

exports.getLogin = (req, res) => {
  let messages = req.flash("error");
  const error = messages.length > 0 ? messages[0] : null;
  res.render("auth/Login", { error });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }).then((u) => {
    if (!u) {
      req.flash(
        "error",
        "User with this email does not exist. Create account to continue."
      );
      return res.redirect("/login");
    }
    return bcryptjs.compare(password, u.password).then((result) => {
      if (!result) {
        req.flash("error", "Wrong password! Try again.");
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

exports.getResetPassword = (req, res) => {
  let messages = req.flash("error");
  const error = messages.length > 0 ? messages[0] : null;
  res.render("auth/Reset", { error });
};

exports.postResetPassword = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      req.flash("error", "An error occured, please try again.");
      console.log(err);
      return res.redirect("/reset-password");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "User with that email does not exist.");
          return res.redirect("/reset-password");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        utils.signUpEmail(
          req.body.email,
          result.name,
          "Reset password request received. Click the button below to reset the password.",
          "PASSWORD RESET",
          {
            instructions:
              "If you did not request this, please ignore this email. The link expires after 1 hour.",
            button: {
              color: "#22BC66",
              text: "Reset Password",
              link: `http://127.0.0.1:3000/reset-password/${result.resetToken}`,
            },
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const resetToken = req.params.token;
  User.findOne({
    resetToken: resetToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        req.flash(
          "error",
          "Oops! Seems like your reset token expired. Enter email and try again."
        );
        return res.redirect("/reset-password");
      }
      let messages = req.flash("error");
      const error = messages.length > 0 ? messages[0] : null;
      res.render("auth/New-Password", { error, userId: user._id.toString() });
    })
    .catch((err) => {
      console.log(err);
    });
};
