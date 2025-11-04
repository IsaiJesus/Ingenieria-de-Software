const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

router.get('/', async (req, res) => {
  try {
    const { id: userId } = req.query; 

    const queryText = 'SELECT name FROM users WHERE id = $1;';

    const { rows } = await pool.query(queryText, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No existe el usuario' });
    }
    
    res.json(rows[0]);

  } catch (err) {
    console.error('Error al obtener vacantes:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.get('/managers', async (req, res) => {
  try {
    const queryText = 'SELECT id, name FROM users WHERE role_id = 3;';
    
    const { rows } = await pool.query(queryText);
    
    res.json(rows);

  } catch (err) {
    console.error('Error al obtener jefes de área:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

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
      res.status(401).json({ detalle: 'Credenciales inválidas' });
    }
  } catch (err) {
    console.error('Error al consultar la base de datos:', err); 
    res.status(500).json({ 
      error: 'Error en el servidor',
      detalle: err.message
    });
  }
});

router.post("/generate-temp-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email es requerido" });
  }

  try {
    const userQuery = "SELECT id, email, name FROM users WHERE email = $1";
    const { rows } = await pool.query(userQuery, [email]);

    if (rows.length === 0) {
      return res.status(200).json({ message: "Si existe una cuenta, se ha enviado un código." });
    }
    const user = rows[0];

    const tempPassword = Math.floor(100000 + Math.random() * 900000).toString();
    
    const updateQuery = "UPDATE users SET password = $1 WHERE id = $2";
    await pool.query(updateQuery, [tempPassword, user.id]);

    await resend.emails.send({
      from: 'Plataforma RH <onboarding@isaijesus.com>',
      to: user.email,
      subject: 'Tu contraseña temporal de acceso',
      html: `
        <h1>Hola, ${user.name}</h1>
        <p>Has solicitado recuperar tu acceso. Usa la siguiente contraseña temporal para iniciar sesión:</p>
        <h2 style="font-size: 36px; letter-spacing: 5px;">${tempPassword}</h2>
        <p>Por tu seguridad, te recomendamos cambiar esta contraseña desde tu perfil inmediatamente después de iniciar sesión.</p>
      `
    });

    res.status(200).json({ message: "Si existe una cuenta, se ha enviado un código." });

  } catch (err) {
    console.error('Error en generate-temp-password:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;