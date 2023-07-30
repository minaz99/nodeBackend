const express = require("express");
const router = express.Router();
const authToken = require("../authToken");
const packageService = require("../services/package.service");

router.get("/", authToken, packageService.getPackages);
router.get("/:id", authToken, packageService.getPackageByID);
router.put("/:id", authToken, packageService.editPackage);
router.post("/", authToken, packageService.newPackage);
router.delete("/:id", authToken, packageService.deletePackage);

module.exports = router;
