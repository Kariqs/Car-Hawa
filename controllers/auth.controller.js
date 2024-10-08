const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const utils = require("../utils/email");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

exports.getSignup = (req, res) => {
  let messages = req.flash("error");
  const error = messages.length > 0 ? messages[0] : null;
  res.render("auth/Signup", {
    error,
    initialInput: {
      email: "",
      name: "",
      phone: "",
      username: "",
      location: "",
      password: "",
      confirmPassword: "",
    },
  });
};

exports.postSignup = async (req, res) => {
  const { email, name, phone, username, location, password, confirmPassword } =
    req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/Signup", {
      error: errors.array()[0].msg,
      initialInput: {
        email,
        name,
        phone,
        username,
        location,
        password,
        confirmPassword,
      },
    });
  }

  try {
    const hashedPassword = await bcryptjs.hash(password, 15);
    const user = new User({
      email,
      name,
      phone,
      username,
      location,
      password: hashedPassword,
      cart: { items: [] },
    });
    const u = await user.save();
    res.redirect("/login");
    utils.signUpEmail(
      email,
      u.name,
      "You have successfully created an account with us.",
      "ACCOUNT CREATED SUCCESSFULLY",
      null
    );
  } catch (err) {
    console.log(err);
    res.redirect("/signup");
  }
};

exports.getLogin = (req, res) => {
  let messages = req.flash("error");
  const error = messages.length > 0 ? messages[0] : null;
  res.render("auth/Login", { error });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      req.flash(
        "error",
        "User with this email does not exist. Create account to continue."
      );
      return res.redirect("/login");
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);

    if (!passwordMatch) {
      req.flash("error", "Wrong password! Try again.");
      return res.redirect("/login");
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((err) => {
      if (err) {
        console.log("Error! Could not save session.", err);
        req.flash("error", "An error occurred. Please try again.");
        return res.redirect("/login");
      }
      res.redirect("/");
    });
  } catch (err) {
    console.log("Error during login process:", err);
    req.flash("error", "An error occurred. Please try again.");
    res.redirect("/login");
  }
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

exports.postResetPassword = async (req, res) => {
  try {
    const buffer = await crypto.randomBytes(32);
    const token = buffer.toString("hex");
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      req.flash("error", "User with that email does not exist.");
      return res.redirect("/reset-password");
    }

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    const result = await user.save();

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
          link: `https://car-hawa.vercel.app/reset-password/${result.resetToken}`,
        },
      }
    );
  } catch (err) {
    console.log(err);
    req.flash("error", "An error occured, please try again.");
    res.redirect("/reset-password");
  }
};

exports.getNewPassword = async (req, res) => {
  const resetToken = req.params.token;
  try {
    const user = await User.findOne({
      resetToken,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      req.flash(
        "error",
        "Oops! Seems like your reset token expired. Enter email and try again."
      );
      return res.redirect("/reset-password");
    }

    let messages = req.flash("error");
    const error = messages.length > 0 ? messages[0] : null;
    res.render("auth/New-Password", {
      error,
      userId: user._id.toString(),
      passwordToken: resetToken,
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "An error occurred. Please try again.");
    res.redirect("/reset-password");
  }
};

exports.postNewPassword = async (req, res) => {
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  const newPassword = req.body.password;

  try {
    const user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });

    if (!user) {
      req.flash("error", "Invalid or expired token.");
      return res.redirect("/reset-password");
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 15);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    req.flash("error", "An error occurred. Please try again.");
    res.redirect("/reset-password");
  }
};
