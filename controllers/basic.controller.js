const User = require("../models/user");
const Product = require("../models/product");
exports.getHome = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("customer/Homepage", {
        products: products,
      });
    })
    .catch((error) => {
      console.log("Error fetching products: " + error);
    });
};

exports.getOneProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((prod) => {
      res.render("customer/View-product", { product: prod });
    })
    .catch((error) => {
      console.log("Error fetching product: " + error);
    });
};

exports.getCart = (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("customer/Cart", { products: products });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
