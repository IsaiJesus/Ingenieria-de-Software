const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.post("/", async (req, res) => {
  const {
    application_id, // Para el UPDATE
    candidate_id,   // Para el INSERT
    manager_id,     // Para el INSERT
    interview_date, // "2025-11-20"
    interview_time, // "14:30"
    interview_link, // "https://zoom.us/..."
  } = req.body;

  if (!application_id || !candidate_id || !manager_id || !interview_date || !interview_time) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const client = await pool.connect();
  const timestamp = `${interview_date}T${interview_time}:00`;
  const message = `Tu entrevista ha sido agendada para el ${interview_date} a las ${interview_time}. ${interview_link ? `Link: ${interview_link}` : 'Revisa tu correo.'}`;

  try {
    await client.query('BEGIN');

    const interviewQuery = `
      INSERT INTO interviews (candidate_id, manager_id, interview_date, interview_link) 
      VALUES ($1, $2, $3, $4);
    `;
    await client.query(interviewQuery, [candidate_id, manager_id, timestamp, interview_link]);

    const applicationQuery = `
      UPDATE applications 
      SET status = 'Entrevista', message = $1
      WHERE id = $2;
    `;
    await client.query(applicationQuery, [message, application_id]);

    await client.query('COMMIT');
    
    res.status(201).json({ message: "Entrevista asignada y candidato actualizado" });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al asignar entrevista (ROLLBACK):', err);
    res.status(500).json({
      error: 'Error en el servidor',
      detalle: err.message
    });
  } finally {
    client.release();
  }
});

module.exports = router;
