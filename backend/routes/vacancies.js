const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const queryText = "SELECT * FROM vacancies ORDER BY created_at DESC;";

    const { rows } = await pool.query(queryText);

    res.json(rows);
  } catch (err) {
    console.error("Error al obtener vacantes:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.post("/", async (req, res) => {
  const {
    title,
    expiration_date,
    salary_range,
    description,
    requirements,
    benefits,
    recruiter_id,
    manager_id,
  } = req.body;

  try {
    const queryText = `
      INSERT INTO vacancies (
        title,
        expiration_date,
        salary_range,
        description,
        requirements,
        benefits,
        recruiter_id,
        manager_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      )
      RETURNING *;
    `;

    const result = await pool.query(queryText, [
      title,
      expiration_date,
      salary_range,
      description,
      requirements,
      benefits,
      recruiter_id,
      manager_id,
    ]);

    res.status(201).json({
      message: "Vacante creada exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error al crear la vacante:", err);
    res.status(500).json({
      error: "Error en el servidor",
      detalle: err.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id: vacancyId } = req.params;

    const queryText = "SELECT * FROM vacancies WHERE id = $1;";

    const { rows } = await pool.query(queryText, [vacancyId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No existe la vacante" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error al obtener vacantes:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id: vacancyId } = req.params;
    const {
      title,
      expiration_date,
      salary_range,
      description,
      requirements,
      benefits,
      manager_id,
    } = req.body;

    if (!title || !description || !manager_id) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const queryText = `
      UPDATE vacancies 
      SET 
        title = $1,
        expiration_date = $2,
        salary_range = $3,
        description = $4,
        requirements = $5,
        benefits = $6,
        manager_id = $7
      WHERE 
        id = $8 
      RETURNING *;
    `;

    const { rows } = await pool.query(queryText, [
      title,
      expiration_date,
      salary_range,
      description,
      requirements,
      benefits,
      manager_id,
      vacancyId,
    ]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontró la vacante para actualizar" });
    }

    res.json({
      message: "Vacante actualizada exitosamente",
      data: rows[0],
    });
  } catch (err) {
    console.error("Error al actualizar la vacante:", err);
    res.status(500).json({
      error: "Error en el servidor",
      detalle: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id: vacancyId } = req.params;

    const queryText = "DELETE FROM vacancies WHERE id = $1;";
    const result = await pool.query(queryText, [vacancyId]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "No se encontró la vacante para eliminar" });
    }

    res.status(200).json({ message: "Vacante eliminada exitosamente" });
  } catch (err) {
    console.error("Error al eliminar la vacante:", err);

    if (err.code === "23503") {
      return res
        .status(409)
        .json({
          error: "No se puede eliminar. Esta vacante ya tiene aplicaciones.",
        });
    }

    res.status(500).json({
      error: "Error en el servidor",
      detalle: err.message,
    });
  }
});

module.exports = router;
