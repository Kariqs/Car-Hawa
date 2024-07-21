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
  if (req.session.user) {
    res.locals.isAdmin = req.session.user.isAdmin;
  } else {
    res.locals.isAdmin = false;
  }

  next();
});

app.use(basicRoutes);
app.use(authRoutes);
app.use("/admin", adminRoutes);

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
