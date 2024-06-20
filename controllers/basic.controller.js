const User = require("../models/user");
const Product = require("../models/product");
const product = require("../models/product");
exports.getHome = (req, res) => {
  const products = Product.find()
    .then((products) => {
      let initialPrice;
      let currentPrice;
      let percentageDiscount;
      for (let product of products) {
        initialPrice = product.initialPrice;
        currentPrice = product.price;
        const discount = initialPrice - currentPrice;
        percentageDiscount = ((discount / initialPrice) * 100).toFixed(0);
        console.log(percentageDiscount);
      }
      res.render("Homepage", {
        products: products,
        percentageDiscount: percentageDiscount,
      });
    })
    .catch((error) => {
      console.log("Error fetching products: " + error);
    });
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
