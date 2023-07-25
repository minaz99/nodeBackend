const express = require("express");
const router = express.Router();
const cs = require("../services/chec.service");

router.get("/", cs.def);
//router.get("/contracts", authToken, cs.contract);
module.exports = router;
