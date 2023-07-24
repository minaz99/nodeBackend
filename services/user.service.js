const db = require("../dbConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userServices = {
  login: async (req, res) => {
    let { email, password } = req.body;
    const user = { email: email };
    try {
      const { rows } = await db.query(`SELECT * FROM users where email = $1`, [
        email,
      ]);
      if (rows[0]) {
        bcrypt.compare(password, userRow.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.json({ accessToken: accessToken, name: userRow.name });
          }
        });
      }
      res.status(404).json("User doesn't exists");
    } catch (err) {
      //res.status(404);
      res.json({ error: err.msg });
    }
  },

  register: async (req, res) => {
    try {
      let { email, name, password } = req.body;
      let hashedPassword = await bcrypt.hash(password, 10);
      const { rowsCount } = await db.query(
        `SELECT * FROM users where email = $1`,
        [email]
      );
      if (rowsCount > 0) res.status(409).json("User already exists");
      else {
        const sql =
          "INSERT INTO users(email,name,password) VALUES($1, $2, $3) RETURNING *";
        const { rows } = await db.query(sql, [email, name, hashedPassword]);
        res.json({ name: name });
      }
    } catch (err) {
      res.json({ error: err.msg });
    }
  },
};

module.exports = userServices;
