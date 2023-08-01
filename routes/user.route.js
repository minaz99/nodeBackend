const express = require("express");
const router = express.Router();
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "PUT", "POST", "DELETE"],
  })
);
const userServices = require("../services/user.service");

router.post("/login", userServices.login);
router.post("/register", userServices.register);

module.exports = router;
