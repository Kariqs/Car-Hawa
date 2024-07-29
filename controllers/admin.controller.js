const Product = require("../models/product");

exports.getAddProduct = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("admin/Add-product", { products: products });
    })
    .catch((error) => {
      console.log("There was error fetching products" + error);
    });
};

exports.postAddProduct = (req, res) => {
  const { category, name, initialPrice, price, description, imageUrl } =
    req.body;
  const discount = (((initialPrice - price) / initialPrice) * 100).toFixed(0);
  const product = new Product({
    category: category,
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

exports.getEditProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("admin/Edit-product", { product: product });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res) => {
  const { id, category, name, initialPrice, price, description, imageUrl } =
    req.body;
  const discount = (((initialPrice - price) / initialPrice) * 100).toFixed(0);
  Product.findById({ _id: id })
    .then((product) => {
      product.category = category;
      product.name = name;
      product.initialPrice = initialPrice;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      product.discount = discount;
      product
        .save()
        .then((result) => {
          res.redirect("/admin/add-product");
        })
        .catch((err) => {
          console.log("An error ocuured and editimg the product failed." + err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
