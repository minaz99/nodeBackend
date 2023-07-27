const express = require("express");
const app = express();
app.use(express.json());
const db = require("../dbConfig");
//const ContractStage = require("../Classes/Contract/ContractStage");

const trial = {
  contractsHello: async (req, res) => {
    try {
      res.status(200).json(req.params.filter);
    } catch (err) {
      res.json("error");
    }
  },
};

module.exports = trial;
