const express = require("express");
const router = express.Router();

const cs = require("../services/chec.service");

router.get("/", cs.def);

module.exports = router;
