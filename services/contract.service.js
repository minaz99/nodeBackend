const express = require("express");
const app = express();
app.use(express.json());
const db = require("../dbConfig");
//const ContractStage = require("../Classes/Contract/ContractStage");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

const contract = {
  getAllContracts: async (req, res) => {
    try {
      const { rows } = await db.query(`SELECT * FROM contracts`);
      res.json({ contracts: rows });
    } catch (err) {
      res.status(400).json({ error: err.msg });
    }
  },
  getContractByID: async (req, res) => {
    try {
      const { rows } = await db.query(`SELECT * FROM contracts where id = $1`, [
        req.params[`id`],
      ]);
      res.json({ contract: rows[0] });
    } catch (err) {
      res.status(400).json({ error: err.msg });
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
      res.status(400).json({ error: err.msg });
    }
  },
  getContractsByCriteria: async (req, res) => {
    try {
      const criteria = req.query.stage
        ? req.query.stage
        : req.query.photographer
        ? req.query.photographer
        : req.query.video;
      const columnCriteria = req.query.stage
        ? "contractStage"
        : req.query.photographer
        ? "photographer"
        : "video";
      const result = await db.query(
        `SELECT * FROM contracts where ${columnCriteria}=$1`,
        [criteria]
      );
      res.json({ contracts: result.rows });
    } catch (err) {
      res.status(400).json("error");
    }
  },
  getContractByBride: async (req, res) => {
    try {
      const result = await db.query(
        `SELECT * FROM contracts WHERE brideName LIKE $1`,
        [`${req.params.bride}%`]
      );
      res.json({ contracts: result.rows });
    } catch (err) {
      res.status(400).json({ error: err.msg });
    }
  },

  updateContractDetails: async (req, res) => {
    try {
      const {
        eventLocation,
        eventDate,
        photographer,
        video,
        contractStage,
        comments,
      } = req.body;
      const result = await db.query(`SELECT * FROM contracts where id = $1`, [
        req.params.id,
      ]);
      const newComments = comments
        ? result.rows[0].comments + ". " + comments
        : result.rows[0].comments;
      const newEventLocation = eventLocation
        ? eventLocation
        : result.rows[0].eventLocation;
      const newEventDate = eventDate ? eventDate : result.rows[0].eventdate;
      const newPhotographer = photographer
        ? photographer
        : result.rows[0].photographer;
      const newVideo = video ? video : result.rows[0].video;
      const newContractStage = contractStage
        ? contractStage
        : result.rows[0].contractstage;
      const result2 = await db.query(
        `UPDATE contracts SET eventLocation = $1, eventDate = $2, photographer = $3, video = $4, contractStage = $5, comments = $6 WHERE id = $7`,
        [
          newEventLocation,
          newEventDate,
          newPhotographer,
          newVideo,
          newContractStage,
          newComments,
          req.params.id,
        ]
      );
      res.json(`Contract has been updated`);
    } catch (err) {
      res.status(400).json({ error: err.msg });
    }
  },
  getContractsByMultipleFilters: async (req, res) => {
    try {
      const { brideName, eventType, eventLocation, contractStage } = req.body;
      let query = `SELECT * FROM contracts where `;
      let paramterIndex = 1;
      let data = [];
      if (brideName) {
        query += `brideName=$${paramterIndex}`;
        paramterIndex += 1;
        data.push(brideName);
      }
      if (eventType) {
        if (paramterIndex > 1) query += " and ";
        query += `eventType=$${paramterIndex}`;
        paramterIndex += 1;
        data.push(eventType);
      }
      if (eventLocation) {
        if (paramterIndex > 1) query += " and ";
        query += `eventLocation=$${paramterIndex}`;
        paramterIndex += 1;
        data.push(eventLocation);
      }
      if (contractStage) {
        if (paramterIndex > 1) query += " and ";
        query += `contractStage=$${paramterIndex}`;
        paramterIndex += 1;
        data.push(contractStage);
      }
      const result = await db.query(query, data);
      res.json({ contracts: result.rows });
    } catch (err) {
      res.status(400).json({ error: err.msg });
    }
  },
  getContractsPerMonth: async (req, res) => {
    try {
      const contractsMonthDetails = [];
      let daysInMonth = getDaysInMonth(req.query.year, req.query.month);
      for (let i = 1; i < daysInMonth; i++) {
        contractsMonthDetails.push({ day: i, contracts: [] });
      }
      const result = await db.query(
        `SELECT * FROM contracts where EXTRACT(MONTH FROM eventDate)=$1 AND EXTRACT(YEAR FROM eventDate)=$2 `,
        [req.query.month, req.query.year]
      );
      result.rows.forEach((contract) =>
        contractsMonthDetails[
          new Date(contract.eventdate).getDate() - 1
        ].contracts.push(contract)
      );
      res.json({ Days: contractsMonthDetails });
    } catch (err) {
      res.status(400).json({ error: err.msg });
    }
  },
  getTableHeaderFilters: async (req, res) => {
    try {
      const result = await db.query(`SELECT * FROM contracts`);
      let eventTypes = [];
      let eventLocations = [];
      let contractStatus = [
        "Done",
        "In Progress",
        "On Hold",
        "Cancelled",
        "Finished",
      ];
      result.rows.forEach((contract) =>
        !eventTypes.includes(contract.eventtype)
          ? eventTypes.push(contract.eventtype)
          : console.log("nvm")
      );
      result.rows.forEach((contract) =>
        !eventLocations.includes(contract.eventlocation)
          ? eventLocations.push(contract.eventlocation)
          : console.log("nvm")
      );
      res.json({
        types: eventTypes,
        locations: eventLocations,
        status: contractStatus,
      });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
};

module.exports = contract;
