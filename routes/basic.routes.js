const express = require("express");
const router = express.Router();
const basicControllers = require("../controllers/basic.controller");

router.get("/", basicControllers.getHome);

router.get("/product/:productId", basicControllers.getOneProduct);
router.get("/cart", basicControllers.getCart);
router.post("/cart", basicControllers.postCart);
router.post("/cart-delete-item", basicControllers.postCartDeleteProduct);
router.post("/create-order", basicControllers.postOrder);
router.get("/orders", basicControllers.getOrders);

module.exports = router;
