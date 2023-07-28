const express = require("express");
const router = express.Router();
const authToken = require("../authToken");

const contractService = require("../services/contract.service");
router.get("/", authToken, contractService.getAllContracts);
router.get("/:id", authToken, contractService.getContractByID);
router.get(
  "/filter/filterType",
  authToken,
  contractService.getContractsByCriteria
);
router.get("/search/:bride", authToken, contractService.getContractByBride);
router.get(
  "/filter/multipleFilters",
  authToken,
  contractService.getContractsByMultipleFilters
);
router.post("/", authToken, contractService.createContract);
router.post("/:id", authToken, contractService.updateContractDetails);

module.exports = router;
