const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");

router.get("/add-product", adminController.getAddProduct);
router.post("/add-product", adminController.postAddProduct);

module.exports = router;
