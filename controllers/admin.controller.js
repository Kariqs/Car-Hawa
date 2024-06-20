const Product = require("../models/product");

exports.getAddProduct = (req, res) => {
  res.render("Add-product");
};

exports.postAddProduct = (req, res) => {
  const { name, initialPrice, price, description, imageUrl } = req.body;
  const product = new Product({
    name: name,
    initialPrice: initialPrice,
    price: price,
    description: description,
    imageUrl: imageUrl,
  });
  product
    .save()
    .then((p) => {
      console.log(p);
      console.log("Product has been saved.");
      res.redirect("/");
    })
    .catch((error) => {
      console.log("An error occured and the product was not saved: " + error);
    });
};
