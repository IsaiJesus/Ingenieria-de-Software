const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const { supabase } = require("../config/supabaseConfig");
const path = require("path");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 'resume' debe coincidir con el nombre del campo en el FormData del frontend
router.post("/", upload.single("resume"), async (req, res) => {
  const { name, gender, age, email, password } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "No se subió ningún archivo CV." });
  }

  try {
    await client.query("BEGIN");

    const fileName = path.parse(req.file.originalname).name.replace(/\s/g, "_");
    const fileExt = path.extname(req.file.originalname);

    const destinationPath = `${fileName}-${Date.now()}${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("cvs_plataforma")
      .upload(destinationPath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from("cvs_plataforma")
      .getPublicUrl(destinationPath);

    const resume_link = urlData.publicUrl;

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

    const values = [name, email, password, gender, age, resume_link];

    const result = await pool.query(queryText, values);
    await client.query("COMMIT");

    res.status(201).json({
      message: "Candidato creado exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.error("Error al crear el usuario:", err);
    res.status(500).json({
      error: "Error en el servidor",
      detalle: err.message,
    });
  } finally {
    client.release();
  }
});

module.exports = router;
