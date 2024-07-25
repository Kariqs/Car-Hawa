const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");

const path = require("path");
const app = express();
const MONGODBURI =
  "mongodb+srv://kariukibenard189:Benada254@cluster0.lzdomio.mongodb.net/car-hawa?retryWrites=true&w=majority&appName=Cluster0";

const sessionStore = new MongoDBStore({
  uri: MONGODBURI,
  collection: "sessions",
});

const User = require("../models/user");
const basicRoutes = require("../routes/basic.routes");
const adminRoutes = require("../routes/admin.routes");
const authRoutes = require("../routes/auth.routes");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(
  session({
    secret: "kariukienard189@gmail.com",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(flash());

app.use((req, res, next) => {
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
        res.locals.isAdmin = false;
        res.locals.cartItemCount = 0; // Set default cart items count to 0
        return next();
      }

      req.user = user; // Attach the user document to req.user
      res.locals.isAdmin = user.isAdmin;

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
});

app.use(basicRoutes);
app.use(authRoutes);
app.use("/admin", adminRoutes);

app.use((req, res, next) => {
  res.status(404).render("error/404.ejs");
});

mongoose
  .connect(MONGODBURI)
  .then((result) => {
    app.listen(3001);
    console.log("Connection was sucessful!");
  })
  .catch((error) => {
    console.log("Connection failed " + error);
  });

module.exports = app;
