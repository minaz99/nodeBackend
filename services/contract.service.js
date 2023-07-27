const express = require("express");
const app = express();
app.use(express.json());
const db = require("../dbConfig");
//const ContractStage = require("../Classes/Contract/ContractStage");

const contract = {
  getAllContracts: async (req, res) => {
    try {
      const { rows } = await db.query(`SELECT * FROM contracts`);
      res.json({ contracts: rows });
    } catch (err) {
      res.json({ error: err.msg });
    }
  },
  getContractByID: async (req, res) => {
    try {
      const { rows } = await db.query(`SELECT * FROM contracts where id = $1`, [
        req.params[`id`],
      ]);
      res.json({ contract: rows[0] });
    } catch (err) {
      res.json({ error: err.msg });
    }
  },
  createContract: async (req, res) => {
    try {
      const {
        secondPartyName,
        brideName,
        groomName,
        eventType,
        eventLocation,
        eventDate,
        civilID,
        phone1,
        phone2,
        contractStatus,
        price,
        photographer,
        video,
        packageID,
        componentIDs,
        contractStage,
        comments,
      } = req.body;
      const result = await db.query(
        `INSERT INTO CONTRACTS(secondPartyName,brideName,groomName,eventType,eventLocation,eventDate,civilID,phone1,phone2,contractStatus,price,photographer,video,packageID,componentIDs,contractStage,comments) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
        [
          secondPartyName,
          brideName,
          groomName,
          eventType,
          eventLocation,
          eventDate,
          civilID,
          phone1,
          phone2,
          contractStatus,
          price,
          photographer,
          video,
          packageID,
          componentIDs,
          contractStage,
          comments,
        ]
      );
      res.status(200).json({ contract: result.rows[0] });
    } catch (err) {
      res.json({ error: err.msg });
    }
  },
  getContractsByStage: async (req, res) => {
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
  getContractByBride: async (req, res) => {
    try {
      const result = await db.query(
        `SELEC * FROM contracts WHERE brideName LIKE $1`,
        [req.params.bride + "%"]
      );
      res.json(200).json({ contracts: result.rows });
    } catch (err) {
      res.json({ error: err });
    }
  },
};

module.exports = contract;
