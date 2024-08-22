const User = require("../models/user");

exports.resLocals = (req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;

  if (!req.session.user) {
    req.user = null;
    res.locals.isAdmin = false;
    res.locals.cartItemCount = 0; // Set default cart items count to 0
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        req.user = null;
        res.locals.cartItemCount = 0; // Set default cart items count to 0
        return next();
      }

      req.user = user; // Attach the user document to req.user

      if (req.session.user) {
        res.locals.user = req.session.user;
        res.locals.isAdmin = req.session.user.isAdmin;
      } else {
        res.locals.isAdmin = false;
      }

      // Calculate total number of items in the cart
      const cartItemCount = user.cart.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      res.locals.cartItemCount = cartItemCount;

      next();
    })
    .catch((err) => {
      console.log(err);
      next(new Error("Failed to fetch user"));
    });
};

exports.isAuth = (req, res, next) => {
  if (!res.locals.isAuthenticated) {
    return res.redirect("/login");
  }
  next();
};
