const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {

    const queryText = 'SELECT * FROM vacancies;';

    const { rows } = await pool.query(queryText);
    
    res.json(rows);

  } catch (err) {
    console.error('Error al obtener vacantes:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id: vacancyId } = req.params; 

    const queryText = 'SELECT * FROM vacancies WHERE id = $1;';

    const { rows } = await pool.query(queryText, [vacancyId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No existe la vacante' });
    }
    
    res.json(rows);

  } catch (err) {
    console.error('Error al obtener vacantes:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;