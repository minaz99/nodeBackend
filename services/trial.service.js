const express = require("express");
const app = express();
app.use(express.json());
const db = require("../dbConfig");
//const ContractStage = require("../Classes/Contract/ContractStage");

const trial = {
  contractsHello: async (req, res) => {
    try {
      const result = await db.query(
        `SELECT * FROM contracts where contractStage=$1`,
        [req.query.stage]
      );
      res.status(200).json({ contracts: result.rows });
    } catch (err) {
      res.json("error");
    }
  },
};

module.exports = trial;
