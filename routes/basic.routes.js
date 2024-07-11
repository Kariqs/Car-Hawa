const express = require("express");
const router = express.Router();
const basicControllers = require("../controllers/basic.controller");

router.get("/", basicControllers.getHome);

router.get("/product/:productId", basicControllers.getOneProduct);

module.exports = router;
