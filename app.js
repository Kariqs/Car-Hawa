const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const path = require("path");
const app = express();

const basicRoutes = require("./routes/basic.routes");
const adminRoutes = require("./routes/admin.routes");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(basicRoutes);
app.use("/admin", adminRoutes);

mongoose
  .connect(
    "mongodb+srv://kariukibenard189:Benada254@cluster0.lzdomio.mongodb.net/car-hawa?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((result) => {
    app.listen(3000);
    console.log("Connection was sucessful!");
  })
  .catch((error) => {
    console.log("Connection failed " + error);
  });
