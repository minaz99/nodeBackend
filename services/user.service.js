const db = require("../dbConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(
  cors({
    origin: "https://julia-wedding.vercel.app/",
    methods: ["GET", "PUT", "POST", "DELETE"],
  })
);
const userServices = {
  login: async (req, res) => {
    try {
      let { email, password } = req.body;
      const user = { email: email };
      const result = await db.query(`SELECT * FROM users where email = $1`, [
        email,
      ]);

      if (result.rowCount > 0) {
        bcrypt.compare(password, result.rows[0].password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.json({
              accessToken: accessToken,
              name: result.rows[0].name,
              role: result.rows[0].role,
            });
            //res.json({ name: result.rows[0].name });
          }
        });
      } else res.status(404).json("User doesn't exist");
    } catch (err) {
      //res.status(404);
      res.json({ error: err.msg });
    }
  },

  register: async (req, res) => {
    try {
      let { email, name, password, role } = req.body;
      let hashedPassword = await bcrypt.hash(password, 10);
      const result = await db.query(`SELECT * FROM users where email = $1`, [
        email,
      ]);
      if (result.rowCount > 0) res.status(409).json("User exists");
      else {
        const result2 = await db.query(
          `INSERT INTO users (email,name,password,role) VALUES ($1, $2, $3, $4)`,
          [email, name, hashedPassword, role]
        );
        res.status(200).json({ data: name, role: role });
      }
      //}
    } catch (err) {
      res.json({ error: err.msg });
    }
  },
};

module.exports = userServices;
