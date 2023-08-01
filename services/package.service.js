const express = require("express");
const db = require("../dbConfig");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "PUT", "POST", "DELETE"],
  })
);
const package = {
  getPackages: async (req, res) => {
    try {
      const result = await db.query(`SELECT * FROM packages`);
      res.json({ packages: result.rows });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
  getPackageByID: async (req, res) => {
    try {
      const result = await db.query(`SELECT * FROM packages where id = $1`, [
        req.params.id,
      ]);
      res.json({ package: result.rows[0] });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
  deletePackage: async (req, res) => {
    try {
      const result = await db.query(
        `DELETE FROM packages where id = $1`,
        req.params.id
      );
      res.json({ package: result.rows[0] });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
  editPackage: async (req, res) => {
    const {
      name,
      pictures,
      magazineName,
      magazineMini,
      video,
      openPhotoAndVideo,
      studio,
      price,
    } = req.body;
    let packageDataToEdit = [];
    const result1 = await db.query(`SELECT * FROM packages where id = $1`, [
      req.params.id,
    ]);
    name
      ? packageDataToEdit.push(name)
      : packageDataToEdit.push(result1.rows[0].name);
    pictures
      ? packageDataToEdit.push(pictures)
      : packageDataToEdit.push(result1.rows[0].pictures);
    magazineName
      ? packageDataToEdit.push(magazineName)
      : packageDataToEdit.push(result1.rows[0].magazinename);
    magazineMini
      ? packageDataToEdit.push(magazineMini)
      : packageDataToEdit.push(result1.rows[0].magazinemini);
    video
      ? packageDataToEdit.push(video)
      : packageDataToEdit.push(result1.rows[0].video);
    openPhotoAndVideo
      ? packageDataToEdit.push(openPhotoAndVideo)
      : packageDataToEdit.push(result1.rows[0].openphotoandavideo);
    studio
      ? packageDataToEdit.push(studio)
      : packageDataToEdit.push(result1.rows[0].studio);
    price
      ? packageDataToEdit.push(price)
      : packageDataToEdit.push(result1.rows[0].price);
    packageDataToEdit.push(req.params.id);
    const result = await db.query(
      `UPDATE packages SET name = $1, pictures = $2, magazineName = $3, magazineMini = $4, video = $5, openPhotoAndVideo = $6, studio = $7, price = $8 where id = $9`,
      packageDataToEdit
    );

    res.json({ package: result.rows[0] });
  },
  newPackage: async (req, res) => {
    try {
      const {
        name,
        pictures,
        magazineName,
        magazineMini,
        video,
        openPhotoAndVideo,
        studio,
        price,
      } = req.body;
      const result = await db.query(
        `INSERT INTO packages(name,
        pictures,
        magazineName,
        magazineMini,
        video,
        openPhotoAndVideo,
        studio,
        price) VALUES($1,$2,$3,$4,$5,$6,$7,$8) `,
        [
          name,
          pictures,
          magazineName,
          magazineMini,
          video,
          openPhotoAndVideo,
          studio,
          price,
        ]
      );
      res.json({ package: result.rows[0] });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
};

module.exports = package;
