require("dotenv").config();
const express = require("express");
//const req = require("express/lib/request");
//const req = require("express/lib/request");
const app = express();
const jwt = require("jsonwebtoken");
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const msg = { msg: "hello there" };
const port = process.env.PORT || 4000;
/*const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");
const initializePassport = require("./passportConfig");
initializePassport(passport);
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());
*/
app.use(express.json());
/*
app.get("/", (req, res) => {
  res.json(msg);
});

app.get("/contracts", authToken, (req, res) => {
  res.json("Authorized");
});
*/

app.post("/login", (req, res) => {
  let { email, password } = req.body;
  const user = { email: email };
  pool.query(`SELECT * FROM users where email = $1`, [email], (err, result) => {
    if (err) throw err;
    if (result.rowCount > 0) {
      const userRow = result.rows[0];
      bcrypt.compare(password, userRow.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
          res.json({ accessToken: accessToken, name: userRow.name });
        }
      });
    } else {
      res.status(404);
      res.json("User doesn't exist");
    }
  });
});

app.post("/register", async (req, res) => {
  let { name, email, password } = req.body;
  if (name && email && password) {
    let hashedPassword = await bcrypt.hash(password, 10);
    pool.query(
      `SELECT * FROM users where email = $1`,
      [email],
      (err, results) => {
        if (err) throw err;
        else if (results.rowCount > 0) {
          res.status(409);
          return res.json("User already exists");
        } else {
          pool.query(
            `INSERT INTO users (email,name,password) VALUES ($1,$2,$3)`,
            [email, name, hashedPassword],
            (err, results) => {
              if (err) throw err;
              res.json(name);
            }
          );
        }
      }
    );
  } else {
    console.log("not all fields are filled");
  }
});

function authToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(port);
