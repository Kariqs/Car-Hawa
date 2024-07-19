const authControllers = require("../controllers/auth.controller");
const express = require("express");
const router = express.Router();

router.get("/signup", authControllers.getSignup);
router.post("/signup", authControllers.postSignup);
router.get("/login", authControllers.getLogin);
router.post("/login", authControllers.postLogin);
router.post("/logout", authControllers.logout);
router.get("/reset-password", authControllers.getResetPassword);
router.post("/reset-password", authControllers.postResetPassword);
router.get("/reset-password/:token", authControllers.getNewPassword);
router.post("/new-password", authControllers.postNewPassword);

module.exports = router;
