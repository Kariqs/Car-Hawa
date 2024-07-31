const { check, body } = require("express-validator");
const User = require("../models/user");

exports.signupValidation = [
  check("email", "Please enter a correct email.")
    .isEmail()
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((u) => {
        if (u) {
          return Promise.reject(
            "User with this email already exists, please use a different email or login to continue."
          );
        }
        return true;
      });
    })
    .trim()
    .normalizeEmail(),
  body("name", "Please enter a correct name.").isLength({ min: 8 }),
  body("phone", "Please use a valid phone number.").isMobilePhone("en-KE"),
  body("username", "Username must have atleast 4 characters").isLength({
    min: 4,
  }),
  body(
    "password",
    "Please check your password. The length must be atleast 8 characters and should be letters and numbers only."
  )
    .isLength({ min: 8 })
    .isAlphanumeric()
    .trim(),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
      }
      return true;
    })
    .trim(),
];
