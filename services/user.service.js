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
      const { rows } = await db.query(`SELECT * FROM users where email = $1`, [
        email,
      ]);
      if (rows[0]) {
        /*   bcrypt.compare(password, userRow.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.json({ accessToken: accessToken, name: userRow.name });
          }
        });*/
        res.json("logged in");
      }
      res.status(404).json("User doesn't exist");
    } catch (err) {
      //res.status(404);
      res.json({ hello: "there" });
    }
  },

  register: async (req, res) => {
    try {
      let { email, name, password } = req.body;
      let hashedPassword = await bcrypt.hash(password, 10);
      const { rows } = await db.query(`SELECT * FROM users where email = $1`, [
        email,
      ]);
      if (rows[0]) res.status(409).json("User exists");
      //else res.json("let's go");
      else {
        const sql = `INSERT INTO users(email,name,password) VALUES($1, $2, $3)`;
        const { newRows } = await db.query(sql, [email, name, hashedPassword]);
        res.json({ data: "yes sir" });
      }
    } catch (err) {
      res.json({ hi: "let's see" });
    }
  },
};

module.exports = userServices;
