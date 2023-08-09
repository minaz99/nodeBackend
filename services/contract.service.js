const express = require("express");
const app = express();
app.use(express.json());
const db = require("../dbConfig");
//const ContractStage = require("../Classes/Contract/ContractStage");
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "PUT", "POST", "DELETE"],
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
        : req.query.video
        ? req.query.video
        : req.query.groomName
        ? req.query.groomName
        : req.query.secondPartyName
        ? req.query.secondPartyName
        : req.query.civilID;
      const columnCriteria = req.query.stage
        ? "contractStage"
        : req.query.photographer
        ? "photographer"
        : req.query.video
        ? "video"
        : req.query.groomName
        ? "groomName"
        : req.query.secondPartyName
        ? "secondPartyName"
        : "civilID";
      const result = await db.query(
        `SELECT * FROM contracts where ${columnCriteria} LIKE $1`,
        [`${criteria}%`]
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
      const { brideName, eventType, eventLocation, contractStatus } = req.query;
      /*const brideName = req.query.brideName;
      const eventType = req.query.eventType;
      const eventLocation = req.query.eventLocation;
      const contractStatus = req.query.contractStatus;*/
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
      if (contractStatus) {
        if (paramterIndex > 1) query += " and ";
        query += `contractStatus=$${paramterIndex}`;
        paramterIndex += 1;
        data.push(contractStatus);
      }
      const result = await db.query(query, data);
      res.json({ contracts: result.rows });

      /*res.json({
        bride: brideName,
        type: eventType,
        location: eventLocation,
        contractStatus: contractStatus,
      });*/
    } catch (err) {
      res.status(400).json({ error: err.msg });
    }
  },
  getContractsPerMonth: async (req, res) => {
    try {
      let result1;
      let result;
      let result3;
      let prevMonth = req.query.month;
      let nextMonth = parseInt(req.query.month);
      let month = parseInt(req.query.month);
      let contractsMonthDetails = [];
      let prevYear = req.query.year;
      let nextYear = parseInt(req.query.year);
      let year = parseInt(req.query.year);
      let daysInMonth = getDaysInMonth(req.query.year, req.query.month);
      let daysNeededFromPreviousMonth = new Date(`${year}/${month}/1`).getDay();

      let daysNeededFromNextMonth =
        6 -
        new Date(
          `${req.query.year}/${req.query.month}/${daysInMonth}`
        ).getDay();
      let daysInPrevMonth = 0;
      if (parseInt(req.query.month) - 1 === 0) {
        daysInPrevMonth = getDaysInMonth(req.query.year - 1, 12);
        prevYear = req.query.year - 1;
        prevMonth = 13;
      } else daysInPrevMonth = getDaysInMonth(prevYear, prevMonth - 1);
      let daysInNextMonth = 0;
      if (parseInt(req.query.month) + 1 === 13) {
        daysInNextMonth = getDaysInMonth(req.query.year + 1, 1);
        nextYear = req.query.year + 1;
        nextMonth = 0;
      } else daysInNextMonth = getDaysInMonth(nextYear, nextMonth + 1);

      if (daysNeededFromPreviousMonth !== 0) {
        /* for (
          let i = daysInPrevMonth - daysNeededFromPreviousMonth + 1;
          i <= daysInPrevMonth;
          i++
        )
          contractsMonthDetails.push({ day: i, contracts: [] });

        for (let i = 1; i <= daysInMonth; i++) {
          contractsMonthDetails.push({ day: i, contracts: [] });
        }

        for (let i = 1; i <= daysNeededFromNextMonth; i++)
          contractsMonthDetails.push({ day: i, contracts: [] });

        result1 = await db.query(
          `SELECT * FROM contracts where EXTRACT(MONTH FROM eventDate)=$1 AND EXTRACT(YEAR FROM eventDate)=$2 `,
          [parseInt(prevMonth) - 1, prevYear]
        );
        result3 = await db.query(
          `SELECT * FROM contracts where EXTRACT(MONTH FROM eventDate)=$1 AND EXTRACT(YEAR FROM eventDate)=$2 `,
          [parseInt(nextMonth) + 1, nextYear]
        );

        result1.rows.forEach((contract) => {
          if (
            new Date(contract.eventdate).getDate() >
            daysInPrevMonth - daysNeededFromPreviousMonth
          )
            contractsMonthDetails[
              (daysInPrevMonth -
                new Date(contract.eventdate).getDate() -
                daysNeededFromPreviousMonth +
                1) *
                -1
            ].contracts.push(contract);
        });

        result3.rows.forEach((contract) =>
          contractsMonthDetails[
            daysNeededFromPreviousMonth +
              daysInMonth +
              new Date(contract.eventdate).getDate() -
              1
          ].contracts.push(contract)
        );
      } else {
        for (let i = 1; i <= daysInMonth; i++) {
          contractsMonthDetails.push({ day: i, contracts: [] });
        }
        */
      }

      result = await db.query(
        `SELECT * FROM contracts where EXTRACT(MONTH FROM eventDate)=$1 AND EXTRACT(YEAR FROM eventDate)=$2 `,
        [parseInt(req.query.month), parseInt(req.query.year)]
      );

      result.rows.forEach((contract) =>
        contractsMonthDetails[
          new Date(contract.eventdate).getDate() +
            daysNeededFromPreviousMonth -
            1
        ].contracts.push(contract)
      );

      /*result.rows.forEach((contract) =>
        contractsMonthDetails[
          new Date(contract.eventdate).getDate()
        ].contracts.push(contract)
      );*/

      res.json({
        Days: contractsMonthDetails,

        prevMonth: prevMonth - 1,
        nextMonth: nextMonth + 1,
        nextYear: nextYear + 1,
        prevYear: prevYear,
        daysInMonth: daysInMonth,
        daysInPrevMonth: daysInPrevMonth,
        daysInNextMonth: daysInNextMonth,
        daysNeededFromPreviousMonth: daysNeededFromPreviousMonth,
        daysNeededFromNextMonth: daysNeededFromNextMonth,
        month: month,
        year: year,
        /* result: result.rows,
        resul1: result1.rows,
        result3: result3.rows,*/
      });
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
      let contractStages = [
        "Signed",
        "Event Finished",
        "Pics Collected",
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
        stages: contractStages,
      });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
};

module.exports = contract;
