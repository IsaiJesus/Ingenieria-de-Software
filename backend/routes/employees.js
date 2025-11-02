const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/manager-view", async (req, res) => {
  try {
    const queryText = `
      SELECT 
        usr.id,
        usr.name,
        emp.gender,
        emp.age,
        emp.plots_link,
        emp.period
      FROM 
        employees AS emp
      JOIN 
        users AS usr ON emp.user_id = usr.id
      WHERE 
        usr.role_id = 4
      ORDER BY
        emp.period DESC;
    `;

    const { rows } = await pool.query(queryText);
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener los empleados:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
