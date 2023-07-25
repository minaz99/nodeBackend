require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());

/*app.get("/", (req, res) => {
  res.json(msg);
});

app.get("/contracts", authToken, (req, res) => {
  res.json("Authorized");
});*/

/*function authToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) res.sendStatus(403);
    req.user = user;
    next();
  });
}*/

const userRouter = require("./routes/user.route");
const checkRouter = require("./routes/chec.route");
const contractRouter = require("./routes/contract.route");
app.use("/user", userRouter);
app.use("/", checkRouter);
app.use("/contracts", contractRouter);
app.listen(process.env.PORT, () =>
  console.log("Server is running on port 5000")
);
