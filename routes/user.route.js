const express = require("express");
const router = express.Router();

const userServices = require("../services/user.service");

router.post("/login", userServices.login);
router.post("/register", userServices.register);

module.exports = router;
