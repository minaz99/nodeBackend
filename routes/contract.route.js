const express = require("express");
const router = express.Router();
const authToken = require("../authToken");

const contractService = require("../services/contract.service");
router.get("/", authToken, contractService.getAllContracts);
router.get("/:id", authToken, contractService.getContractByID);
router.get("/?filter", authToken, contractService.contractsHello);
router.post("/", authToken, contractService.createContract);

module.exports = router;
