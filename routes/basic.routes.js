const express = require("express");
const router = express.Router();
const basicControllers = require("../controllers/basic.controller");

router.get("/", basicControllers.getHome);

router.get("/product/:productId", basicControllers.getOneProduct);
router.get("/cart", basicControllers.getCart);
router.post("/cart", basicControllers.postCart);

module.exports = router;
