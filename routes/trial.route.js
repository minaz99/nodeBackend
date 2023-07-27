const express = require("express");
const router = express.Router();

const trialService = require("../services/trial.service");

//router.post("/login", userServices.login);
router.post("/contract", trialService.contractsHello);

module.exports = trialService;
