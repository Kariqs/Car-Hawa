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
