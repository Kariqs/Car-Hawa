const Product = require("../models/product");
const shortid = require("shortid");
const path = require("path");
const Order = require("../models/orders");
const storage = require("../config/firebaseStorageConfig");

exports.getAddProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.render("admin/Add-product", { products: products });
  } catch (error) {
    console.log("There was an error fetching products: " + error);
  }
};

exports.postAddProduct = async (req, res) => {
  try {
    const { category, name, initialPrice, price, description } = req.body;
    const image = req.file;
    const discount = (((initialPrice - price) / initialPrice) * 100).toFixed(0);

    //check if an image was selected
    if (!image) {
      res.redirect("/add-product");
    }

    //generate a unique file name using shortid
    const fileExtension = path.extname(image.originalname).toLowerCase();
    const fileName = `CARHAWA_${shortid.generate()}${fileExtension}`;
    //create a reference to the file in Firebase Storage
    const file = storage.bucket().file(fileName);
    //upload the image to firebase storage
    await file.save(image.buffer, {
      contentType: image.mimetype,
      resumable: false,
    });
    //get a public URL to access the image
    const [readUrl] = await file.getSignedUrl({
      action: "read",
      expires: "01-01-2500",
    });
    //get a public URL to delete the image
    const [deleteUrl] = await file.getSignedUrl({
      action: "delete",
      expires: "01-01-2500",
    });
    const product = new Product({
      category: category,
      name: name,
      initialPrice: initialPrice,
      price: price,
      description: description,
      imageUrl: readUrl,
      deleteUrl: deleteUrl,
      discount: discount,
    });
    await product.save();
    res.redirect("/admin/add-product");
  } catch (error) {
    console.log("An error occurred and the product was not saved: " + error);
  }
};

exports.deleteProduct = async (req, res) => {
  const prodId = req.params.productId;

  try {
    const product = await Product.findByIdAndDelete(prodId);
    if (!product) {
      console.log("Product not found.");
    }
    //extract the filename from the deleteUrl stored.
    const deleteUrl = new URL(product.deleteUrl);
    const fileName = decodeURIComponent(
      deleteUrl.pathname.split("/").slice(2).join("/")
    );
    //delete the image from Firebase
    const file = storage.bucket().file(fileName);
    await file.delete();
    //redirect after deleteing the file.
    res.redirect("/admin/add-product");
  } catch (error) {
    console.log("An error occurred trying to delete product: " + error);
  }
};

exports.getEditProduct = async (req, res) => {
  const prodId = req.params.productId;

  try {
    const product = await Product.findById(prodId);
    res.render("admin/Edit-product", { product: product });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditProduct = async (req, res) => {
  const { id, category, name, initialPrice, price, description, imageUrl } =
    req.body;
  const discount = (((initialPrice - price) / initialPrice) * 100).toFixed(0);

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    product.category = category;
    product.name = name;
    product.initialPrice = initialPrice;
    product.price = price;
    product.description = description;
    product.imageUrl = imageUrl;
    product.discount = discount;

    await product.save();
    res.redirect("/admin/add-product");
  } catch (err) {
    console.log("An error occurred while editing the product: " + err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    // Find orders for the user
    const order = await Order.find();
    // Render the orders page
    res.render("customer/orders", { orders: order });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
