const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/orders");
const ITEMS_PER_PAGE = 5;

exports.getHome = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const totalItems = await Product.find().countDocuments();
    const products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.render("customer/Homepage", {
      products: products,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
    });
  } catch (error) {
    console.log("Error fetching products: " + error);
  }
};

exports.getOneProduct = async (req, res) => {
  const prodId = req.params.productId;

  try {
    const prod = await Product.findById(prodId);
    res.render("customer/View-product", { product: prod });
  } catch (error) {
    console.log("Error fetching product: " + error);
  }
};

exports.getCart = async (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }

  try {
    await req.user.populate("cart.items.productId");
    const products = req.user.cart.items;
    res.render("customer/Cart", { products: products });
  } catch (err) {
    console.log(err);
  }
};

exports.postCart = async (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }

  const prodId = req.body.productId;

  try {
    const product = await Product.findById(prodId);
    await req.user.addToCart(product);
    res.status(200).json({ message: "Product added to cart"});
  } catch (err) {
    console.log(err);
  }
};

exports.postCartDeleteProduct = async (req, res) => {
  const prodId = req.body.productId;

  try {
    await req.user.removeFromCart(prodId);
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    await req.user.populate("cart.items.productId");
    const products = req.user.cart.items.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });

    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user,
      },
      products: products,
      status: "Order Placed",
    });

    await order.save();
    await req.user.clearCart();
    res.redirect("/orders");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const order = await Order.find({ "user.userId": req.user._id });
    res.render("customer/orders", { orders: order });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.postReview = async (req, res) => {
  const prodId = req.params.productId;
  const reviewText = req.body.review;
  const rating = req.body.rating;

  if (prodId && reviewText && rating) {
    try {
      const newReview = {
        comment: reviewText,
        rating: rating,
      };

      const updatedProduct = await Product.findByIdAndUpdate(
        prodId,
        { $push: { reviews: newReview } },
        { new: true, useFindAndModify: false }
      );

      if (updatedProduct) {
        res.status(201).json({ message: "Review was sent" });
      } else {
        res.status(404).send("Product not found");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  } else {
    res
      .status(400)
      .send("Invalid request: Missing product ID, review, or rating");
  }
};
