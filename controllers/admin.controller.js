const Product = require("../models/product");

exports.getAddProduct = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("Add-product", { products: products });
    })
    .catch((error) => {
      console.log("There was error fetching products" + error);
    });
};

exports.postAddProduct = (req, res) => {
  const { name, initialPrice, price, description, imageUrl } = req.body;
  const discount = (((initialPrice - price) / initialPrice) * 100).toFixed(0);
  const product = new Product({
    name: name,
    initialPrice: initialPrice,
    price: price,
    description: description,
    imageUrl: imageUrl,
    discount: discount,
  });
  product
    .save()
    .then((p) => {
      res.redirect("/admin/add-product");
    })
    .catch((error) => {
      console.log("An error occured and the product was not saved: " + error);
    });
};

exports.deleteProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findByIdAndDelete(prodId)
    .then(() => {
      res.redirect("/admin/add-product");
    })
    .catch((error) => {
      console.log("An error occured trying to delete product." + error);
    });
};
