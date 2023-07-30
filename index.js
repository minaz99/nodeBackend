require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const userRouter = require("./routes/user.route");
const contractRouter = require("./routes/contract.route");
const componentRouter = require("./routes/component.route");
const packageRouter = require("./routes/package.route");
app.use("/user", userRouter);
app.use("/contracts", contractRouter);
app.use("/components", componentRouter);
app.use("/packages", packageRouter);
app.listen(process.env.PORT, () =>
  console.log("Server is running on port 5000")
);
