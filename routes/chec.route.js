const express = require("express");
const router = express.Router();

const cs = require("../services/chec.service");

function authToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) res.sendStatus(403);
    req.user = user;
    next();
  });
}

router.get("/", cs.def);
router.get("/contracts", authToken, cs.contract);
module.exports = router;
