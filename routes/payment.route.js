const express = require("express");
const router = express.Router();
const authToken = require("../authToken");
const paymentService = require("../services/payment.service");

router.get("/:id", authToken, paymentService.getPaymentsInfoForContract);
router.post("/", authToken, paymentService.makePayment);

module.exports = router;