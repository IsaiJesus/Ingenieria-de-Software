const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    //const { id: userId } = req.body; 

    const queryText = `SELECT
        app.id,
        vac.title,
        usr.name
      FROM 
        applications AS app
      JOIN 
        vacancies AS vac ON app.vacancy_id = vac.id
      JOIN
        users AS usr ON app.candidate_id = usr.id
      ORDER BY 
        app.created_at;
    `;

    const { rows } = await pool.query(queryText);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No se pudo conseguir las aplicaciones' });
    }
    
    res.json(rows);

  } catch (err) {
    console.error('Error al obtener vacantes:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;