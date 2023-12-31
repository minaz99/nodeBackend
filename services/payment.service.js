const express = require("express");
const db = require("../dbConfig");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(
  cors({
    origin: "https://julia-wedding.vercel.app",
    methods: ["GET", "PUT", "POST", "DELETE"],
  })
);
const payment = {
  getPaymentsInfoForContract: async (req, res) => {
    try {
      const result = await db.query(
        `SELECT * from payments where contractID = $1`,
        [req.params.id]
      );
      const contract = await db.query(`SELECT * FROM contracts where id = $1`, [
        req.params.id,
      ]);
      let contractPrice = contract.rows[0].price;
      let totalPaid = 0;
      result.rows.forEach((payment) => (totalPaid += payment.amount));
      res.json({
        payments: result.rows,
        paid: totalPaid,
        due: contractPrice - totalPaid,
      });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
  makePayment: async (req, res) => {
    try {
      const { amount } = req.body;
      const { rowCount } = await db.query(
        `SELECT * FROM payments where contractID = $1`,
        [req.params.id]
      );
      let paymentNumber = rowCount + 1;
      const result = await db.query(
        `INSERT INTO payments(contractID,paymentNumber,amount) VALUES($1,$2,$3)`,
        [req.params.id, paymentNumber, Math.abs(amount)]
      );
      res.json({ payment: result.rows });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
};

module.exports = payment;
