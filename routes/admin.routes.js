const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const authMiddeware = require("../middlewares/auth.middleware");

router.get("/add-product", authMiddeware.isAuth, adminController.getAddProduct);
router.post("/add-product", adminController.postAddProduct);
router.get(
  "/edit-product/:productId",
  authMiddeware.isAuth,
  adminController.getEditProduct
);
router.post("/edit-product", adminController.postEditProduct);
router.post("/product/delete/:productId", adminController.deleteProduct);
router.get("/orders", adminController.getAllOrders)

module.exports = router;
