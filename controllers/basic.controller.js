const User = require("../models/user");
const Product = require("../models/product");
exports.getHome = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("Homepage", {
        products: products,
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

exports.getOneProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((prod) => {
      res.render("View-product", { product: prod });
    })
    .catch((error) => {
      console.log("Error fetching product: " + error);
    });
};
