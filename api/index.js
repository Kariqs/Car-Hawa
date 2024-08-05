const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const multer = require("multer");
require("dotenv").config();

const path = require("path");
const app = express();
const MONGODBURI = process.env.MONGODBURI;

const sessionStore = new MongoDBStore({
  uri: MONGODBURI,
  collection: "sessions",
});

const basicRoutes = require("../routes/basic.routes");
const adminRoutes = require("../routes/admin.routes");
const authRoutes = require("../routes/auth.routes");
const authMiddleware = require("../middlewares/auth.middleware");
const { storage } = require("firebase-admin");

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(
  multer({ storage: multer.memoryStorage(), fileFilter: fileFilter }).single(
    "image"
  )
);
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

app.use(authMiddleware.resLocals);

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
  })
  .catch((error) => {
    console.log("Connection failed " + error);
  });

module.exports = app;
