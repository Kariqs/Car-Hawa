const express = require("express");
const bodyParser = require("body-parser");
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

app.listen(3000);
