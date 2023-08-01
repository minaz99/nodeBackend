require("dotenv").config();
const db = require("./dbConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "PUT", "POST", "DELETE"],
  })
);
app.use(express.json());

/*const userRouter = require("./routes/user.route");
const contractRouter = require("./routes/contract.route");
const componentRouter = require("./routes/component.route");
const packageRouter = require("./routes/package.route");*/
const userServices = require("./services/user.service");

//router.post("/login", userServices.login);
//router.post("/register", userServices.register);
app.post("/user/login", userServices.login);
app.post("/user/register", userServices.register);
/*app.use("/user", userRouter);
app.use("/contracts", contractRouter);
app.use("/components", componentRouter);
app.use("/packages", packageRouter);*/
/*app.get("/", async (req, res) => {
  res.json({ msg: "Hello there" });
});
app.post("/login", async (req, res) => {
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
          res.json({ accessToken: accessToken, name: result.rows[0].name });
          //res.json({ name: result.rows[0].name });
        }
      });
    } else res.status(404).json("User doesn't exist");
  } catch (err) {
    res.status(400).json({ error: err });
  }
});*/
app.listen(process.env.PORT, () =>
  console.log("Server is running on port 5000")
);
