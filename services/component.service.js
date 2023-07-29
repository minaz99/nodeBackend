const express = require("express");
const db = require("../dbConfig");
const app = express();
app.use(express.json());

const component = {
  getComponents: async (req, res) => {
    try {
      const result = await db.query(`SELECT * FROM components`);
      res.json({ components: result.rows });
    } catch (err) {
      res.status(400).json({ error: err.msg });
    }
  },
  getComponentByID: async (req, res) => {
    try {
      const result = await db.query(`SELECT * FROM components where id = $1`, [
        req.params.id,
      ]);
      res.json({ component: result.rows[0] });
    } catch (err) {
      res.status(400).json({ error: err.msg });
    }
  },
  newComponent: async (req, res) => {
    try {
      const { componentType, name, price } = req.body;
      const result = await db.query(
        `INSERT INTO components(componentType,name,price) VALUES($1,$2,$3)`,
        [componentType, name, price]
      );
      res.json({ component: result.rows[0] });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
  editComponent: async (req, res) => {
    try {
      let editableProperties = [];
      const { componentType, name, price } = req.body;
      let paramIndex = 1;
      let query = `UPDATE components `;
      if (componentType) {
        query += `SET componentType = $${paramIndex}`;
        paramIndex += 1;
        editableProperties.push(componentType);
      }
      if (name) {
        if (paramIndex > 1) query += " and ";
        query += `SET name = $${paramIndex}`;
        paramIndex += 1;
        editableProperties.push(name);
      }
      if (price) {
        if (paramIndex > 1) query += " and ";
        query += `SET price = $${paramIndex}`;
        paramIndex += 1;
        editableProperties.push(price);
      }
      query += ` where id = $${paramIndex}`;
      editableProperties.push(req.params.id);
      //res.json({ query: query, editableProperties: editableProperties });
      const result = await db.query(query, [editableProperties]);
      res.json({ component: result.rows });
    } catch (err) {
      res.status(400).json({ error: err.msg });
    }
  },
  getComponentsByType: async (req, res) => {
    try {
      const result = await db.query(
        `SELECT * FROM components where componentType=$1`,
        [req.query.type]
      );
      res.json({ components: result.rows });
    } catch (err) {
      res.status(400).json({ error: err.msg });
    }
  },
  deleteComponent: async (req, res) => {
    try {
      const result = await db.query(`DELETE FROM components where id = $1`, [
        req.params.id,
      ]);
      res.json({ component: result.rows[0] });
    } catch (err) {
      res.status(400).json({ error: err.msg });
    }
  },
};

module.exports = component;
