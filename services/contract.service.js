const express = require("express");
const app = express();
app.use(express.json());
const db = require("../dbConfig");
//const ContractStage = require("../Classes/Contract/ContractStage");
const cors = require("cors");
app.use(
  cors({
    origin: "https://julia-wedding.vercel.app",
    methods: ["GET", "PUT", "POST", "DELETE"],
  })
);
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

const contractsPerPage = (pageNo, contracts) => {
  pageNo *= 9;
  return contracts.slice(pageNo - 9, pageNo);
};

const contract = {
  getAllContracts: async (req, res) => {
    try {
      const page = req.params.page;
      const { rows } = await db.query(`SELECT * FROM contracts`);
      res.json({
        contracts: contractsPerPage(page, rows.reverse()),
        total: rows.length,
        pages:
          rows.length / 9 > parseInt(rows.length / 9)
            ? parseInt(rows.length / 9) + 1
            : parseInt(rows.length / 9),
      });
    } catch (err) {
      res.status(400).json({ error: err.msg });
    }
  },
  getContractByID: async (req, res) => {
    try {
      const { rows } = await db.query(`SELECT * FROM contracts where id = $1`, [
        req.params[`id`],
      ]);
      const result = await db.query(
        `SELECT * FROM contractstages where contractID = $1`,
        [rows[0].id]
      );
      if (rows[0].eventdate < new Date())
        await db.query(
          `UPDATE contractstages SET eventFinished = $1 where contractID = $2`,
          [true, req.params[`id`]]
        );
      res.json({ contract: rows[0], stages: result.rows[0] });
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
        createdBy,
        paidAmount,
        zoomLight,
        cameraCrane,
        hangingCamera,
        cameraRonin,
      } = req.body;
      const result = await db.query(
        `INSERT INTO CONTRACTS(secondPartyName,brideName,groomName,eventType,eventLocation,eventDate,civilID,phone1,phone2,contractStatus,price,photographer,video,packageID,componentIDs,contractStage,comments,createdBy,dateCreated, zoomLight,cameraCrane,hangingCamera,cameraRonin) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23) RETURNING id`,
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
          createdBy,
          new Date().toLocaleDateString(),
          zoomLight,
          cameraCrane,
          hangingCamera,
          cameraRonin,
        ]
      );
      if (paidAmount > 0) {
        const result2 = await db.query(
          `INSERT INTO payments(contractID,paymentNumber,amount) VALUES($1,$2,$3)`,
          [result.rows[0].id, 1, Math.abs(paidAmount)]
        );
      }
      const result3 = await db.query(
        `INSERT INTO contractstages(contractID,signed,eventFinished,picsCollected,videoCollected,promoCollected,finished) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [result.rows[0].id, true, false, false, false, false, false]
      );
      /*const result2 = await db.query(
        `SELECT * FROM contracts where civilID = $1`,
        [civilID]
      );*/
      res.status(200).json({ id: result.rows[0].id });
    } catch (err) {
      res.status(400).json({ error: err.msg });
    }
  },
  getContractsByCriteria: async (req, res) => {
    try {
      const page = req.query.page;
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
      res.json({
        contracts: contractsPerPage(page, result.rows),
        total: result.rows.length,
        pages:
          result.rows.length / 9 > parseInt(result.rows.length / 9)
            ? parseInt(result.rows.length / 9) + 1
            : parseInt(result.rows.length / 9),
      });
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
  updateContractStages: async (req, res) => {
    try {
      const {
        eventFinished,
        picsCollected,
        videoCollected,
        promoCollected,
        finished,
      } = req.body;
      const result = await db.query(
        `SELECT * FROM contractstages where contractID = $1`,
        [req.params.id]
      );
      let newEventFinished = eventFinished
        ? eventFinished
        : result.rows[0].eventfinished;
      let newPicsCollected = picsCollected
        ? picsCollected
        : result.rows[0].picscollected;
      let newVideoCollected = videoCollected
        ? videoCollected
        : result.rows[0].videocollected;
      let newPromoCollected = promoCollected
        ? promoCollected
        : result.rows[0].promocollected;
      let newFinished = finished ? finished : result.rows[0].finished;
      const result2 = await db.query(
        `UPDATE contractstages SET eventFinished = $1, picsCollected = $2, videoCollected = $3, promoCollected = $4, finished = $5 where contractID = $6`,
        [
          newEventFinished,
          newPicsCollected,
          newVideoCollected,
          newPromoCollected,
          newFinished,
          req.params.id,
        ]
      );
      res.json(`Contract stage has been updated`);
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
        phone1,
        phone2,
        contractStage,
        comments,
        componentIDs,
        price,
        packageID,
        zoomLight,
        cameraCrane,
        hangingCamera,
        cameraRonin,
      } = req.body;
      const result = await db.query(`SELECT * FROM contracts where id = $1`, [
        req.params.id,
      ]);
      const newComments = comments ? comments : result.rows[0].comments;
      const newEventLocation = eventLocation
        ? eventLocation
        : result.rows[0].eventlocation;
      const newEventDate = eventDate ? eventDate : result.rows[0].eventdate;
      const newPhotographer = photographer
        ? photographer
        : result.rows[0].photographer;
      const newVideo = video ? video : result.rows[0].video;
      const newPhone1 = phone1 ? phone1 : result.rows[0].phone1;
      const newPhone2 = phone2 ? phone2 : result.rows[0].phone2;
      const newContractStage = contractStage
        ? contractStage
        : result.rows[0].contractstage;
      const newComponentIDs = componentIDs
        ? componentIDs
        : result.rows[0].componentids;
      const newPrice = price ? price : result.rows[0].price;
      const newPackageID = packageID ? packageID : result.rows[0].packageid;
      const newZoomLight = zoomLight ? zoomLight : result.rows[0].zoomlight;
      const newCameraCrane = cameraCrane
        ? cameraCrane
        : result.rows[0].cameracrane;
      const newHangingCamera = hangingCamera
        ? hangingCamera
        : result.rows[0].hangingcamera;
      const newCameraRonin = cameraRonin
        ? cameraRonin
        : result.rows[0].cameraronin;
      const result2 = await db.query(
        `UPDATE contracts SET eventLocation = $1, eventDate = $2, photographer = $3, video = $4, contractStage = $5, comments = $6, phone1=$7, phone2=$8, componentIds= $9, price=$10, packageId=$11, zoomLight=$12, cameraCrane=$13, hangingCamera=$14, cameraRonin=$15 WHERE id = $16`,
        [
          newEventLocation,
          newEventDate,
          newPhotographer,
          newVideo,
          newContractStage,
          newComments,
          newPhone1,
          newPhone2,
          newComponentIDs,
          newPrice,
          newPackageID,
          newZoomLight,
          newCameraCrane,
          newHangingCamera,
          newCameraRonin,
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
      const { page, brideName, eventType, eventLocation, contractStatus } =
        req.query;
      /*const brideName = req.query.brideName;
      const eventType = req.query.eventType;
      const eventLocation = req.query.eventLocation;
      const contractStatus = req.query.contractStatus;*/
      let query = `SELECT * FROM contracts where `;
      let paramterIndex = 1;
      let data = [];
      if (brideName) {
        query += `brideName LIKE $${paramterIndex}`;
        paramterIndex += 1;
        data.push(`${brideName}%`);
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
      res.json({
        contracts: contractsPerPage(page, result.rows),
        total: result.rows.length,
        pages:
          result.rows.length / 9 > parseInt(result.rows.length / 9)
            ? parseInt(result.rows.length / 9) + 1
            : parseInt(result.rows.length / 9),
      });

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
  getContractPerMonthForTable: async (req, res) => {
    try {
      const page = req.query.page;
      const month = req.query.month;
      const year = req.query.year;
      const result = await db.query(
        `SELECT * FROM contracts where EXTRACT(MONTH FROM eventDate)=$1 AND EXTRACT(YEAR FROM eventDate)=$2`,
        [month, year]
      );
      res.json({
        contracts: contractsPerPage(page, result.rows),
        total: result.rows.length,
        pages:
          result.rows.length / 9 > parseInt(result.rows.length / 9)
            ? parseInt(result.rows.length / 9) + 1
            : parseInt(result.rows.length / 9),
      });
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
      let prevYear = parseInt(req.query.year);
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

      if (daysNeededFromPreviousMonth !== 0 || daysNeededFromNextMonth !== 0) {
        for (
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

        result3.rows.forEach((contract) => {
          if (new Date(contract.eventdate).getDate() <= daysNeededFromNextMonth)
            contractsMonthDetails[
              daysNeededFromPreviousMonth +
                daysInMonth +
                new Date(contract.eventdate).getDate() -
                1
            ].contracts.push(contract);
        });
      } else {
        for (let i = 1; i <= daysInMonth; i++) {
          contractsMonthDetails.push({ day: i, contracts: [] });
        }
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
      });
    } catch (err) {
      res.status(400).json({ error: err.msg });
    }
  },

  getContractsByDay: async (req, res) => {
    try {
      const { day, month, year } = req.query;
      const result = await db.query(
        `SELECT * FROM contracts where EXTRACT(DAY FROM eventDate)=$1 AND EXTRACT(MONTH FROM eventDate)=$2 AND EXTRACT(YEAR FROM eventDate)=$3 `,
        [parseInt(day), parseInt(month), parseInt(year)]
      );
      res.json({
        contracts: result.rows,
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
  addPhotographer: async (req, res) => {
    try {
      const { name, type, date } = req.body;
      await db.query(
        `INSERT INTO photographers (name,type,date) VALUES ($1,$2,$3)`,
        [name, type, date]
      );
      res.json("Photographer Added");
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
  setPhotographerForContract: async (req, res) => {
    try {
      //console.log(req.params);
      const id = req.params[`id`];
      const { photographerID } = req.body;
      await db.query(`UPDATE photographers SET contractid = $1 where id = $2`, [
        id,
        photographerID,
      ]);
      await db.query(`UPDATE contract`);
      res.json("Photographer has been set");
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
  getPhotographersPerDate: async (req, res) => {
    try {
      const { date, type } = req.query;

      const day = new Date(date).getDate();
      const month = new Date(date).getMonth() + 1;
      const year = new Date(date).getFullYear();
      const result = await db.query(
        `SELECT * FROM photographers WHERE EXTRACT(DAY FROM date)=$1 AND EXTRACT(MONTH FROM date)=$2 AND EXTRACT(YEAR FROM date)=$3 AND type = $4 AND contractID IS NULL`,
        [day, month, year, type]
      );
      res.json({ Photographers: result.rows });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
  getPhotographersPerTypeAndContract: async (req, res) => {
    try {
      const id = req.params[`id`];
      const type = req.params[`type`];
      const result = await db.query(
        `SELECT * FROM photographers where contractID = $1 AND type = $2`,
        [id, type]
      );
      res.json({ Photographers: result.rows });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
};

module.exports = contract;
