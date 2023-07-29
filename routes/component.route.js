const express = require("express");
const router = express.Router();
const authToken = require("../authToken");

const componentService = require("../services/component.service");

router.get("/", authToken, componentService.getComponents);
router.get("/:id", authToken, componentService.getComponentByID);
router.get("/type/", authToken, componentService.getComponentsByType);
router.post("/", authToken, componentService.newComponent);
router.put("/:id", authToken, componentService.editComponent);
router.delete("/:id", authToken, componentService.deleteComponent);

module.exports = router;
