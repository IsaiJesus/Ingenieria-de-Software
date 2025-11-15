const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const axios = require('axios');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

router.get("/manager-view", async (req, res) => {
  try {
    const queryText = `
      SELECT 
        usr.id,
        usr.name,
        emp.gender,
        emp.age,
        emp.plots_link,
        emp.period
      FROM 
        employees AS emp
      JOIN 
        users AS usr ON emp.user_id = usr.id
      WHERE 
        usr.role_id = 4
      ORDER BY
        emp.period DESC;
    `;

    const { rows } = await pool.query(queryText);
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener los empleados:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.post("/:id/generate-report", async (req, res) => {
  try {
    const { id: employeeId } = req.params;
    const { managerId, contextInfo, ratings } = req.body;

    // Obtener nombre del empleado (para la gráfica)
    const { rows: [employee] } = await pool.query(
      'SELECT name FROM users WHERE id = $1',
      [employeeId]
    );

    // Obtener email del jefe de área (para el correo)
    const { rows: [manager] } = await pool.query(
      'SELECT email FROM users WHERE id = $1',
      [managerId]
    );

    if (!employee || !manager) {
      return res.status(404).json({ error: "Empleado o mánager no encontrado" });
    }

    // Construir el payload para la API de Python
    const pythonPayload = {
      employee_name: employee.name,
      context_info: contextInfo, 
      ratings_dict: ratings
    };

    // Llamar a la API de Python para generar la gráfica
    console.log("Contactando API de Python para generar gráfica...");
    const response = await axios.post(
      'http://localhost:5001/generate-graph',
      pythonPayload
    );
    
    const { plot_link } = response.data;

    if (!plot_link) {
      throw new Error("La API de Python no devolvió un link de la gráfica.");
    }

    // Actualizar la BD con el link y el periodo
    // (Usamos user_id para la tabla employees)
    await pool.query(
      'UPDATE employees SET plots_link = $1, period = $2 WHERE user_id = $3',
      [plot_link, contextInfo.period, employeeId]
    );

    // Enviar correo al mánager con la gráfica
    const subject = `Evaluación de Desempeño: ${employee.name}`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1>Reporte de Evaluación</h1>
        <p>Se ha generado el reporte de desempeño para <strong>${employee.name}</strong> correspondiente al periodo ${contextInfo.period}.</p>
        <p>Puedes ver la gráfica de radar a continuación:</p>
        <img src="${plot_link}" alt="Gráfica de Desempeño de ${employee.name}" style="width:100%; max-width:600px; border:1px solid #ddd;" />
        <br>
        <p>El enlace al reporte también ha sido guardado en tu panel.</p>
        <p>Atentamente,<br>El Sistema de RH</p>
      </div>
    `;

    await resend.emails.send({
      from: 'Plataforma RH <onboarding@isaijesus.com>',
      to: [manager.email],
      subject: subject,
      html: htmlBody,
    });

    res.status(200).json({ message: "Reporte generado y correo enviado.", plot_link: plot_link });

  } catch (err) {
    const errorMsg = err.response ? err.response.data.error : err.message;
    console.error("Error al generar el reporte:", errorMsg);
    res.status(500).json({ error: "Error en el servidor", detalle: errorMsg });
  }
});

module.exports = router;
