const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const { candidate_id: candidateId } = req.query;
    if (!candidateId) {
      return res.status(400).json({ error: "Se requiere un candidate_id" });
    }

    const queryText = `
      SELECT 
        app.*, 
        vac.title 
      FROM 
        applications AS app
      JOIN 
        vacancies AS vac ON app.vacancy_id = vac.id
      WHERE 
        app.candidate_id = $1;
    `;

    const { rows } = await pool.query(queryText, [candidateId]);

    res.json(rows);
  } catch (err) {
    console.error("Error al obtener vacantes:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.get("/check", async (req, res) => {
  try {
    const { vacancy_id: vacancyId, candidate_id: candidateId } = req.query;

    if (!vacancyId || !candidateId) {
      return res.status(400).json({ error: "Faltan IDs" });
    }

    const queryText =
      "SELECT id FROM applications WHERE vacancy_id = $1 AND candidate_id = $2;";
    const { rows } = await pool.query(queryText, [vacancyId, candidateId]);

    if (rows.length > 0) {
      res.json({ hasApplied: true, applicationId: rows[0].id });
    } else {
      res.json({ hasApplied: false, applicationId: null });
    }
  } catch (err) {
    console.error("Error chequeando aplicación:", err);
    res.status(500).json({ error: "Error en el servidor al chequear" });
  }
});

router.get("/:applicationId", async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { candidate_id: candidateId } = req.query;

    if (!applicationId || !candidateId) {
      return res.status(400).json({ error: "Faltan IDs en la petición" });
    }

    const queryText = `
      SELECT 
        app.*, 
        vac.title,
        vac.salary_range
      FROM 
        applications AS app
      JOIN 
        vacancies AS vac ON app.vacancy_id = vac.id
      WHERE 
        app.id = $1 AND app.candidate_id = $2;
    `;
    const { rows } = await pool.query(queryText, [applicationId, candidateId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No se encontró la aplicación" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error al obtener la aplicación:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { candidate_id: candidateId, vacancy_id: vacancyId } = req.body;

    const status = "Aplicación";
    const queryText = `
      INSERT INTO applications (candidate_id, vacancy_id, status) 
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const { rows } = await pool.query(queryText, [
      candidateId,
      vacancyId,
      status,
    ]);

    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Ya has aplicado a esta vacante" });
    }
    console.error("Error al crear la aplicación:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
