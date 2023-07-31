const express = require("express");
const router = express.Router();
const authToken = require("../authToken");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
const contractService = require("../services/contract.service");
const paymentService = require("../services/payment.service");
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
router.get("/filter/calender", authToken, contractService.getContractsPerMonth);
router.get(
  "/:id/payments",
  authToken,
  paymentService.getPaymentsInfoForContract
);
router.get(
  "/filter/tableHeaders",
  authToken,
  contractService.getTableHeaderFilters
);
router.post("/", authToken, contractService.createContract);
router.post("/:id", authToken, contractService.updateContractDetails);
router.post("/:id/payments", authToken, paymentService.makePayment);

module.exports = router;
