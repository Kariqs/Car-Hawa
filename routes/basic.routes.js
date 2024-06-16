const express = require("express");
const router = express.Router();
const basicControllers = require("../controllers/basic.controller");

router.get("/", basicControllers.getHome);
router.get("/signup", basicControllers.getSignup);
router.get("/login", basicControllers.getLogin);

module.exports = router;
