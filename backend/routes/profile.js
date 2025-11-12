const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const { supabase } = require("../config/supabaseConfig");
const path = require("path");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/:id", async (req, res) => {
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
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error al obtener el perfil:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.put("/:id", upload.single("resume"), async (req, res) => {
  const { id: userId } = req.params;
  const { name, email, password, gender, age, role_id } = req.body;
  const client = await pool.connect();

  let newResumeLink = null;
  let oldResumeLink = null;

  try {
    if (Number(role_id) === 1 && req.file) {
      const oldLinkQuery = await pool.query(
        "SELECT resume_link FROM candidates WHERE user_id = $1",
        [userId]
      );
      if (oldLinkQuery.rows[0] && oldLinkQuery.rows[0].resume_link) {
        oldResumeLink = oldLinkQuery.rows[0].resume_link;
      }
    }

    await client.query("BEGIN");

    // Lógica de Cloudinary: Si se subió un archivo...
    if (req.file) {
      const fileName = path
        .parse(req.file.originalname)
        .name.replace(/\s/g, "_");
      const fileExt = path.extname(req.file.originalname);
      const destinationPath = `${fileName}-${Date.now()}${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("cvs_plataforma")
        .upload(destinationPath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("cvs_plataforma")
        .getPublicUrl(destinationPath);

      newResumeLink = urlData.publicUrl;
    }

    if (password && password.trim() !== "") {
      await client.query(
        "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4",
        [name, email, password, userId]
      );
    } else {
      await client.query(
        "UPDATE users SET name = $1, email = $2 WHERE id = $3",
        [name, email, userId]
      );
    }

    // Lógica para actualizar la tabla 'candidates'
    if (Number(role_id) === 1) {
      let candidateQueryText;
      let candidateValues;

      // Decide qué consulta ejecutar
      if (newResumeLink) {
        // --- Escenario A: Se subió un CV nuevo ---
        // Actualiza todo, incluyendo el resume_link
        candidateQueryText = `
          INSERT INTO candidates (user_id, gender, age, resume_link)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (user_id) DO UPDATE 
            SET gender = $2, age = $3, resume_link = $4;
        `;
        candidateValues = [userId, gender || null, age || null, newResumeLink];
      } else {
        // --- Escenario B: NO se subió CV nuevo ---
        // Actualiza todo MENOS el resume_link (para no borrar el anterior)
        candidateQueryText = `
          INSERT INTO candidates (user_id, gender, age)
          VALUES ($1, $2, $3)
          ON CONFLICT (user_id) DO UPDATE 
            SET gender = $2, age = $3;
        `;
        candidateValues = [userId, gender || null, age || null];
      }

      await client.query(candidateQueryText, candidateValues);
    }

    await client.query("COMMIT");

    // Borra el archivo antiguo de supabase
    if (oldResumeLink) {
      try {
        const oldFileName = oldResumeLink.split('cvs_plataforma/')[1];
        
        if (oldFileName) {
           console.log(`Borrando archivo antiguo: ${oldFileName}`);
           await supabase.storage.from('cvs_plataforma').remove([oldFileName]);
        }
      } catch (removeError) {
        // Esto no es un error fatal (la BD ya se actualizó)
        // así que solo lo registramos.
        console.error("Error al borrar el archivo antiguo de Supabase:", removeError.message);
      }
    }

    res.json({
      message: "Perfil actualizado exitosamente",
      new_resume_link: newResumeLink,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error al actualizar el perfil:", err);
    res.status(500).json({ error: "Error en el servidor al actualizar" });
  } finally {
    client.release();
  }
});

module.exports = router;
