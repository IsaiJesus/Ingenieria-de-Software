const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: 'Email y contraseña son requeridos' });

  try {
    const result = await pool.query(
      'SELECT id, role_id FROM users WHERE email=$1 AND password=$2',
      [email, password]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  } catch (err) {
    console.error('Error al consultar la base de datos:', err); 
    res.status(500).json({ 
      error: 'Error en el servidor',
      detalle: err.message
    });
  }
});

module.exports = router;