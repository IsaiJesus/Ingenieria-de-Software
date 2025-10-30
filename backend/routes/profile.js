const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/:id', async (req, res) => {
  try {
    const { id: userId } = req.params; 

    const queryText = `
      SELECT 
        u.id, u.name, u.email, u.role_id,
        c.gender, c.age, c.resume_link
      FROM users u
      LEFT JOIN candidates c ON u.id = c.user_id
      WHERE u.id = $1;
    `;

    const { rows } = await pool.query(queryText, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(rows[0]);

  } catch (err) {
    console.error('Error al obtener el perfil:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.put('/:id', async (req, res) => {
  const { id: userId } = req.params;
  const { name, email, password, gender, age, resume_link, role_id } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    if (password && password.trim() !== '') {
      await client.query(
        'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4',
        [name, email, password, userId]
      );
    } else {
      await client.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [name, email, userId]
      );
    }

    if (Number(role_id) === 1) { 
      const candidateQuery = `
        INSERT INTO candidates (user_id, gender, age, resume_link)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id) DO UPDATE 
          SET gender = $2, age = $3, resume_link = $4;
      `;
      await client.query(candidateQuery, [
        userId,
        gender || null,
        age || null,
        resume_link || null,
      ]);
    }

    await client.query('COMMIT');
    res.json({ message: 'Perfil actualizado exitosamente' });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al actualizar el perfil:', err);
    res.status(500).json({ error: 'Error en el servidor al actualizar' });
  } finally {
    client.release();
  }
});

module.exports = router;