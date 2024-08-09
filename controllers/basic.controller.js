const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/orders");
const Review = require("../models/review");
const review = require("../models/review");
const ITEMS_PER_PAGE = 7;

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

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = async (req, res, next) => {
  try {
    // Populate the user's cart items
    await req.user.populate("cart.items.productId");
    // Map the cart items to products
    const products = req.user.cart.items.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });
    // Create a new order
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
    // Find orders for the user
    const order = await Order.find({ "user.userId": req.user._id });
    // Render the orders page
    res.render("customer/orders", { orders: order });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.postReview = async (req, res) => {
  const prodId = req.params.productId;
  const review = req.body.review;
  if (prodId && review) {
    try {
      const newReview = new Review({ productId: prodId, review: review });
      await newReview.save();
      res.redirect(`/product/${prodId}`);
    } catch (err) {
      console.log(err);
    }
  }
};
