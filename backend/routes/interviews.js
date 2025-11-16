const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/", async (req, res) => {
  const {
    application_id, // Para el UPDATE
    candidate_id, // Para el INSERT
    manager_id, // Para el INSERT
    interview_date, // "2025-11-20"
    interview_time, // "14:30"
    interview_link, // "https://zoom.us/..."
  } = req.body;

  if (
    !application_id ||
    !candidate_id ||
    !manager_id ||
    !interview_date ||
    !interview_time
  ) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const [year, month, day] = interview_date.split("-");
  const formattedDate = `${day}-${month}-${year}`;
  const timestamp = `${interview_date}T${interview_time}:00`;

  let client;

  const message = `Tu entrevista ha sido agendada para el <strong>${formattedDate}</strong> a las <strong>${interview_time}</strong>. ${
    interview_link
      ? `Link de la reunión: <a href="${interview_link}" target="blank">${interview_link}</a>`
      : "Revisa tu correo."
  }`;

  try {
    client = await pool.connect();

    const {
      rows: [candidate],
    } = await client.query("SELECT name, email FROM users WHERE id = $1", [
      candidate_id,
    ]);

    const {
      rows: [manager],
    } = await client.query("SELECT name FROM users WHERE id = $1", [manager_id]);

    const {
      rows: [application],
    } = await client.query(
      `SELECT v.title 
       FROM applications a 
       JOIN vacancies v ON a.vacancy_id = v.id 
       WHERE a.id = $1`,
      [application_id]
    );

    if (!candidate || !manager || !application) {
      return res
        .status(404)
        .json({ error: "Datos de usuario o vacante no encontrados" });
    }

    await client.query("BEGIN");

    const interviewQuery = `
      INSERT INTO interviews (candidate_id, manager_id, interview_date, interview_link) 
      VALUES ($1, $2, $3, $4);
    `;
    await client.query(interviewQuery, [
      candidate_id,
      manager_id,
      timestamp,
      interview_link,
    ]);

    const applicationQuery = `
      UPDATE applications 
      SET status = 'Entrevista', message = $1
      WHERE id = $2;
    `;
    await client.query(applicationQuery, [message, application_id]);

    await client.query("COMMIT");

    const subject = `¡Has sido seleccionado para una entrevista! - ${application.title}`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1>¡Felicidades, ${candidate.name}!</h1>
        <p>Nos complace informarte que has avanzado a la siguiente etapa en el proceso de selección para la vacante de <strong>${application.title}</strong>.</p>
        <p>Tu entrevista ha sido agendada con <strong>${manager.name}</strong> (Jefe de Área) en la siguiente fecha y hora:</p>
        
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <p style="font-size: 18px; margin: 5px;"><strong>Fecha:</strong> ${formattedDate}</p>
          <p style="font-size: 18px; margin: 5px;"><strong>Hora:</strong> ${interview_time}</p>
        </div>
        
        <p style="margin-top: 20px;">Por favor, únete a la reunión virtual usando el siguiente enlace:</p>
        
        <a href="${interview_link}" 
           target="_blank" 
           style="background-color: #007bff; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-top: 10px;">
          Acceder a la Entrevista
        </a>
        
        <p style="margin-top: 25px;">Te deseamos mucho éxito.</p>
        <p>Atentamente,<br>El equipo de Recursos Humanos</p>
      </div>
    `;

    await resend.emails.send({
      from: "Plataforma RH <onboarding@isaijesus.com>",
      to: [candidate.email],
      subject: subject,
      html: htmlBody,
    });

    res
      .status(201)
      .json({ message: "Entrevista asignada y candidato actualizado" });
  } catch (err) {
    if (client) {
      await client.query("ROLLBACK");
    }
    console.error("Error al asignar entrevista (ROLLBACK):", err);

    res.status(500).json({
      error: "Error en el servidor",
      detalle: err.message,
    });
  } finally {
    if (client) {
      client.release();
      console.log("Cliente de BD liberado.");
    }
  }
});

module.exports = router;
