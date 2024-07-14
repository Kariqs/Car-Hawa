const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const authMiddeware = require("../middlewares/auth.middleware");

router.get("/add-product",authMiddeware.isAuth, adminController.getAddProduct);
router.post("/add-product", adminController.postAddProduct);
router.post("/product/delete/:productId", adminController.deleteProduct);

module.exports = router;
