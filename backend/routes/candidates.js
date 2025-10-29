const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.post('/', async (req, res) => {
  const { name, gender, age, email, password, resume } = req.body;

  const queryText = `
    WITH new_user AS (
      INSERT INTO users (name, email, password, role_id)
      VALUES ($1, $2, $3, (SELECT id FROM roles WHERE name = 'candidate'))
      RETURNING id
    )
    INSERT INTO candidates (user_id, gender, age, resume_link)
    VALUES ((SELECT id FROM new_user), $4, $5, $6)
    RETURNING *;
  `;

  const values = [name, email, password, gender, age, resume];

  try {
    const result = await pool.query(queryText, values);
    res.status(201).json({
      message: "Candidato creado exitosamente",
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error al crear el usuario:', err); 
    res.status(500).json({ 
      error: 'Error en el servidor',
      detalle: err.message
    });
  }
});

module.exports = router;