const authControllers = require("../controllers/auth.controller");
const express = require("express");
const router = express.Router();

router.get("/signup", authControllers.getSignup);
router.post("/signup", authControllers.postSignup);
router.get("/login", authControllers.getLogin);

module.exports = router;
