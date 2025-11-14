const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const axios = require('axios');
const fs = require('fs');
const pdf = require('pdf-parse');

const IA_API_URL = 'http://localhost:5001/predict';

async function fetchResumeText(resumeUrl) { // Renombré a resumeUrl por claridad
  try {
    // 1. Descargar el PDF desde la URL
    // Le pedimos a axios que nos dé la respuesta como un 'arraybuffer'
    const response = await axios.get(resumeUrl, {
      responseType: 'arraybuffer' 
    });

    // 2. Convertir la respuesta (ArrayBuffer) en un Buffer de Node.js
    const dataBuffer = Buffer.from(response.data);

    // 3. Usar pdf-parse con el Buffer (esto ya lo tenías)
    const data = await pdf(dataBuffer);
    return data.text;
    
  } catch (error) {
    // Manejar errores si la URL no existe o el archivo está corrupto
    console.error('Error al descargar o leer el PDF desde la URL:', error.message);
    throw new Error('No se pudo extraer el texto del CV.');
  }
}

async function runIaPrediction(application, candidate, vacancy) {
  try {
    // Recolectar los 4 datos crudos
    const rawResumeText = await fetchResumeText(candidate.resume_link);
    const category = vacancy.title;
    const langTestResult = application.language_test_result;
    const techTestResult = application.technical_test_result;

    // Construir el payload para la API de IA
    const payload = {
      raw_text: rawResumeText,
      category: category,
      language_test: langTestResult,
      technical_test: techTestResult,
    };

    // Llamar a la API de Python
    console.log('Contactando a la API de IA para predicción...');
    const response = await axios.post(IA_API_URL, payload);

    // Devolver el resultado (1 o 0)
    return response.data.ia_shortlisted;
  } catch (error) {
    console.error('Error al contactar la API de IA:', error.message);
    throw error;
  }
}

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
        app.candidate_id = $1
      ORDER BY
        app.created_at DESC;
    `;

    const { rows } = await pool.query(queryText, [candidateId]);

    res.json(rows);
  } catch (err) {
    console.error("Error al obtener vacantes:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { candidate_id: candidateId, vacancy_id: vacancyId } = req.body;

    const status = "Aplicación";

    // Datos del usuario
    const userQuery = 'SELECT name, email FROM users WHERE id = $1';
    const { rows: [user] } = await pool.query(userQuery, [candidateId]);
    if (!user) {
      return res.status(404).json({ error: "No se encontró el candidato" });
    }

    // Datos de la vacante
    const vacancyQuery = 'SELECT title FROM vacancies WHERE id = $1';
    const { rows: [vacancy] } = await pool.query(vacancyQuery, [vacancyId]);
    if (!vacancy) {
      return res.status(404).json({ error: "No se encontró la vacante" });
    }

    const insertQueryText = `
      INSERT INTO applications (candidate_id, vacancy_id, status) 
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const { rows: [newApplication] } = await pool.query(insertQueryText, [
      candidateId,
      vacancyId,
      status,
    ]);

    const subject = `Hemos recibido tu aplicación para: ${vacancy.title}`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1>Hola, ${user.name},</h1>
        <p>Confirmamos que hemos recibido tu aplicación para la vacante de <strong>${vacancy.title}</strong>.</p>
        <p>Tu perfil está en la primera etapa de nuestro proceso de selección.</p>
        <p>El siguiente paso es nuestra prueba de idioma. En breve, recibirás un nuevo correo con las instrucciones y el enlace para completarla.</p>
        <br>
        <p>¡Mucho éxito!</p>
        <p>Atentamente,<br>El equipo de Recursos Humanos</p>
      </div>
    `;
    await resend.emails.send({
      from: 'Plataforma RH <onboarding@isaijesus.com>',
      to: [user.email],
      subject: subject,
      html: htmlBody,
    });

    res.status(201).json(newApplication);

  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Ya has aplicado a esta vacante" });
    }
    console.error("Error al crear la aplicación:", err);
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

router.get("/manager-view", async (req, res) => {
  try {
    const { manager_id: managerId } = req.query;

    if (!managerId) {
      return res.status(400).json({ error: "Se requiere manager_id" });
    }

    const queryText = `
      SELECT 
        usr.id,
        usr.name,
        cand.gender,
        cand.age,
        cand.resume_link,
        vac.id AS vacancy_id,
	      app.id AS application_id,
        app.status
      FROM 
        applications AS app
      JOIN 
        vacancies AS vac ON app.vacancy_id = vac.id
      JOIN 
        candidates AS cand ON app.candidate_id = cand.user_id
      JOIN 
        users AS usr ON cand.user_id = usr.id
      WHERE 
        vac.manager_id = $1
        AND app.ia_shortlisted = TRUE
      ORDER BY
        app.created_at DESC; -- Muestra las aplicaciones más recientes primero
    `;

    const { rows } = await pool.query(queryText, [managerId]);
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener candidatos para manager:", err);
    res.status(500).json({ error: "Error en el servidor" });
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

router.patch("/:id/discard", async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const queryText = `
      UPDATE applications 
      SET status = 'Rechazado' 
      WHERE id = $1 
      RETURNING *;
    `;
    const { rows } = await pool.query(queryText, [applicationId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No se encontró la aplicación" });
    }
    res.status(200).json({ 
      message: "Candidato descartado exitosamente", 
      data: rows[0] 
    });
  } catch (err) {
    console.error('Error al descartar al candidato:', err);
    res.status(500).json({
      error: 'Error en el servidor',
      detalle: err.message
    });
  }
});

router.patch("/:id/hire", async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const queryText = `
      UPDATE applications 
      SET status = 'Aceptado' 
      WHERE id = $1 
      RETURNING *;
    `;
    const { rows } = await pool.query(queryText, [applicationId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No se encontró la aplicación" });
    }
    res.status(200).json({ 
      message: "Candidato contratado exitosamente", 
      data: rows[0] 
    });
  } catch (err) {
    console.error('Error al contratar al candidato:', err);
    res.status(500).json({
      error: 'Error en el servidor',
      detalle: err.message
    });
  }
});

// Envio de prueba de idioma
// POST /:id/send_language_test
router.post("/:id/send_language_test", async (req, res) => {
  try {
    const { id: applicationId } = req.params;

    const updateQuery = `
      UPDATE applications 
      SET status = 'Prueba de idioma' 
      WHERE id = $1
      RETURNING *;
    `;
    const { rows: [application] } = await pool.query(updateQuery, [applicationId]);

    if (!application) {
      return res.status(404).json({ error: "Aplicación no encontrada" });
    }

    // Obtener datos para enviar el correo
    const { rows: [user] } = await pool.query(
      'SELECT name, email FROM users WHERE id = $1',
      [application.candidate_id]
    );
    const { rows: [vacancy] } = await pool.query(
      'SELECT title FROM vacancies WHERE id = $1',
      [application.vacancy_id]
    );

    // Redactar y enviar el correo con el link a la prueba
    const subject = `Prueba de Idioma para ${vacancy.title}`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1>Hola, ${user.name},</h1>
        <p>Hemos revisado tu aplicación para <strong>${vacancy.title}</strong> y queremos invitarte al primer paso.</p>
        <p>Este paso es una prueba de idioma. Por favor, ingresa al siguiente enlace para completarla:</p>
        <p><a href="[AQUÍ VA TU LINK SIMULADO A LA PRUEBA DE IDIOMA]">Acceder a la Prueba de Idioma</a></p>
        <br>
        <p>¡Mucho éxito!</p>
        <p>Atentamente,<br>El equipo de Recursos Humanos</p>
      </div>
    `;

    await resend.emails.send({
      from: 'Plataforma RH <onboarding@isaijesus.com>',
      to: [user.email],
      subject: subject,
      html: htmlBody,
    });

    res.status(200).json({ 
      message: 'Prueba de idioma enviada y estado actualizado.',
      data: application
    });

  } catch (err) {
    console.error('Error al enviar la prueba de idioma:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// Envio de prueba técnica
// POST /:id/submit_language_test
router.post("/:id/submit_language_test", async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const { result: testResult } = req.body; // 1 (pasó) o 0 (reprobó)

    if (testResult === undefined) {
      return res.status(400).json({ error: "Se requiere 'result' (1 o 0)" });
    }

    // --- CASO 1: El candidato REPROBÓ la prueba de idioma ---
    if (testResult === 0) {
      const updateQuery = `
        UPDATE applications 
        SET language_test_result = 0
        WHERE id = $1
        RETURNING *;
      `;
      // NO se cambia el status. El candidato queda en 'Prueba de idioma'.
      const { rows: [application] } = await pool.query(updateQuery, [applicationId]);
      
      return res.status(200).json({ 
        message: 'Resultado (0) de la prueba de idioma registrado.',
        data: application
      });
    }

    // --- CASO 2: El candidato APROBÓ la prueba de idioma ---
    const updateQuery = `
      UPDATE applications 
      SET language_test_result = 1, status = 'Prueba técnica' 
      WHERE id = $1
      RETURNING *;
    `;
    const { rows: [application] } = await pool.query(updateQuery, [applicationId]);

    const { rows: [user] } = await pool.query(
      'SELECT name, email FROM users WHERE id = $1',
      [application.candidate_id]
    );
    const { rows: [vacancy] } = await pool.query(
      'SELECT title FROM vacancies WHERE id = $1',
      [application.vacancy_id]
    );

    const subject = `Siguiente paso: Prueba Técnica para ${vacancy.title}`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1>Hola, ${user.name},</h1>
        <p>¡Felicidades! Has aprobado la prueba de idioma.</p>
        <p>El siguiente paso en tu proceso para la vacante de <strong>${vacancy.title}</strong> es la prueba técnica.</p>
        <p>Por favor, ingresa al siguiente enlace para completarla:</p>
        <p><a href="[AQUÍ VA TU LINK SIMULADO A LA PRUEBA TÉCNICA]">Acceder a la Prueba Técnica</a></p>
        <br>
        <p>¡Mucho éxito!</p>
        <p>Atentamente,<br>El equipo de Recursos Humanos</p>
      </div>
    `;

    await resend.emails.send({
      from: 'Plataforma RH <onboarding@isaijesus.com>',
      to: [user.email],
      subject: subject,
      html: htmlBody,
    });

    res.status(200).json({ 
      message: 'Prueba de idioma aprobada. Correo de prueba técnica enviado.',
      data: application
    });

  } catch (err) {
    console.error('Error al procesar la prueba de idioma:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// Resultado de prueba técnica y envio de datos a IA
router.post("/:id/submit_technical_test", async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const { result: testResult } = req.body; // 1 (pasó) o 0 (reprobó)

    if (testResult === undefined) {
      return res.status(400).json({ error: "Se requiere 'result' (1 o 0)" });
    }

    // --- CASO 1: El candidato REPROBÓ la prueba técnica ---
    if (testResult === 0) {
      const updateQuery = `
        UPDATE applications 
        SET technical_test_result = 0
        WHERE id = $1
        RETURNING *;
      `;
      const { rows: [application] } = await pool.query(updateQuery, [applicationId]);
      
      return res.status(200).json({ 
        message: 'Resultado (0) de la prueba técnica registrado.',
        data: application
      });
    }

    // --- CASO 2: El candidato APROBÓ la prueba técnica ---
    const updateQuery = `
      UPDATE applications 
      SET technical_test_result = 1, status = 'Pruebas completadas' 
      WHERE id = $1
      RETURNING *;
    `;
    const { rows: [application] } = await pool.query(updateQuery, [applicationId]);

    // Obtener datos para enviar a la API de IA
    const { rows: [candidate] } = await pool.query(
      'SELECT * FROM candidates WHERE user_id = $1',
      [application.candidate_id]
    );
    const { rows: [vacancy] } = await pool.query(
      'SELECT * FROM vacancies WHERE id = $1',
      [application.vacancy_id]
    );

    if (!candidate || !vacancy) {
      return res.status(404).json({ error: "No se encontraron datos del candidato o la vacante" });
    }

    // Llamar a la API de IA (Flask)
    const iaResult = await runIaPrediction(
      application,
      candidate,
      vacancy
    );

    let finalMessage = '';

    // Evaluar el resultado de la IA
    if (iaResult === 1) {
      // --- IA APROBÓ ---
      await pool.query(
        'UPDATE applications SET ia_shortlisted = TRUE WHERE id = $1',
        [applicationId]
      );
      finalMessage = 'Prueba técnica aprobada. IA APROBÓ al candidato (shortlisted).';
      
    } else {
      // --- IA RECHAZÓ ---
      
      // Actualizar el estado a 'Rechazado'
      await pool.query(
        "UPDATE applications SET status = 'Rechazado' WHERE id = $1",
        [applicationId]
      );
      
      // Obtener datos del usuario para el correo
      const { rows: [user] } = await pool.query(
        'SELECT name, email FROM users WHERE id = $1',
        [application.candidate_id]
      );

      // Enviar correo de rechazo
      const subject = `Actualización sobre tu proceso para: ${vacancy.title}`;
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h1>Hola, ${user.name},</h1>
          <p>Te agradecemos por completar la prueba técnica para la vacante de <strong>${vacancy.title}</strong>.</p>
          <p>Después de una cuidadosa revisión de tus pruebas y perfil por parte de nuestro sistema de IA, hemos decidido no continuar con tu candidatura en esta ocasión.</p>
          <p>Apreciamos tu tiempo e interés y te deseamos mucho éxito en tu búsqueda.</p>
          <br>
          <p>Atentamente,<br>El equipo de Recursos Humanos</p>
        </div>
      `;

      await resend.emails.send({
        from: 'Plataforma RH <onboarding@isaijesus.com>',
        to: [user.email],
        subject: subject,
        html: htmlBody,
      });

      finalMessage = 'Prueba técnica aprobada. IA RECHAZÓ al candidato. Correo enviado.';
    }

    // Responder al frontend
    res.status(200).json({ 
      message: finalMessage,
      ia_shortlisted: iaResult === 1,
      data: application
    });

  } catch (err) {
    console.error('Error al procesar la prueba técnica:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});
module.exports = router;
