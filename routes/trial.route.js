const express = require("express");
const router = express.Router();

const trialService = require("../services/trial.service");

//router.post("/login", userServices.login);
router.get("/", trialService.contractsHello);

module.exports = router;
