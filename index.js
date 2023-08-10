require("dotenv").config();
const db = require("./dbConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const app = express();
const cors = require("cors");
const authToken = require("./authToken");
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
const contractService = require("./services/contract.service");
const paymentService = require("./services/payment.service");
const componentService = require("./services/component.service");
const packageService = require("./services/package.service");
//router.post("/login", userServices.login);
//router.post("/register", userServices.register);
app.post("/user/login", userServices.login);
app.post("/user/register", userServices.register);
app.get("/contracts/", authToken, contractService.getAllContracts);
app.get("/contracts/:id", authToken, contractService.getContractByID);
app.get(
  "/contracts/filter/filterType",
  authToken,
  contractService.getContractsByCriteria
);
app.get(
  "/contracts/search/:bride",
  authToken,
  contractService.getContractByBride
);
app.get(
  "/contracts/filter/multipleFilters",
  authToken,
  contractService.getContractsByMultipleFilters
);
app.get(
  "/contracts/filter/calender",
  authToken,
  contractService.getContractsPerMonth
);
app.get(
  "/contracts/:id/payments",
  authToken,
  paymentService.getPaymentsInfoForContract
);
app.get(
  "/contracts/filter/tableHeaders",
  authToken,
  contractService.getTableHeaderFilters
);
app.post("/contracts/", authToken, contractService.createContract);
app.post("/contracts/:id", authToken, contractService.updateContractDetails);
app.post("/contracts/:id/payments", authToken, paymentService.makePayment);

app.get("/components/", authToken, componentService.getComponents);
app.get("/components/:id", authToken, componentService.getComponentByID);
app.get(
  "/components/type/:type",
  authToken,
  componentService.getComponentsByType
);
app.post("/components/", authToken, componentService.newComponent);
app.put("/components/:id", authToken, componentService.editComponent);
app.delete("/components/:id", authToken, componentService.deleteComponent);

app.get("/packages/", authToken, packageService.getPackages);
app.get("/packages/:id", authToken, packageService.getPackageByID);
app.put("/packages/:id", authToken, packageService.editPackage);
app.post("/packages/", authToken, packageService.newPackage);
app.delete("/packages/:id", authToken, packageService.deletePackage);
/*app.use("/user", userRouter);
app.use("/contracts", contractRouter);
app.use("/components", componentRouter);
app.use("/packages", packageRouter);*/

app.listen(process.env.PORT, () =>
  console.log("Server is running on port 5000")
);
