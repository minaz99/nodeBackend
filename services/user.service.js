const db = require("../dbConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
app.use(express.json());
const userServices = {
  login: async (req, res) => {
    try {
      let { email, password } = req.body;
      const user = { email: email };
      const result = await db.query(`SELECT * FROM users where email = $1`, [
        email,
      ]);
      result.rowCount > 0
        ? res.json("logged in")
        : res.status(404).json("User doesn't exist");
    } catch (err) {
      //res.status(404);
      res.json({ error: err.msg });
    }
  },

  register: async (req, res) => {
    try {
      let { email, name, password } = req.body;
      let hashedPassword = await bcrypt.hash(password, 10);
      const result = await db.query(`SELECT * FROM users where email = $1`, [
        email,
      ]);
      if (result.rowCount > 0) res.status(409).json("User exists");
      else {
        res.status(200).json("User exists");
      }
      //}
    } catch (err) {
      res.json({ error: err.msg });
    }
  },
};

module.exports = userServices;
