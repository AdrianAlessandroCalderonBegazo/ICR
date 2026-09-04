const { pool } = require("../db");
const { AppError } = require("../errors");

function validar(data, { parcial = false } = {}) {
  const campos = ["pregunta", "respuesta_markdown"];
  if (!parcial) {
    for (const campo of campos) {
      if (!data[campo] || !String(data[campo]).trim()) {
        throw new AppError("SCHEMA_INVALID", `Falta el campo obligatorio '${campo}'`, 400);
      }
    }
  }
  for (const campo of campos) {
    if (data[campo] !== undefined && !String(data[campo]).trim()) {
      throw new AppError("SCHEMA_INVALID", `'${campo}' no puede estar vacío`, 400);
    }
  }
}

async function findById(itemId) {
  const r = await pool.query("SELECT * FROM chatbot_items WHERE item_id = $1", [itemId]);
  if (r.rows.length === 0) {
    throw new AppError("CHATBOT_ITEM_NOT_FOUND", `No existe una pregunta con id '${itemId}'`, 404);
  }
  return r.rows[0];
}

// Público: solo lo activo, en el orden que definió el editor.
async function listPublic() {
  const r = await pool.query(
    "SELECT item_id, pregunta, respuesta_markdown FROM chatbot_items WHERE activo = true ORDER BY orden ASC, created_at ASC"
  );
  return r.rows;
}

async function listAdmin() {
  const r = await pool.query("SELECT * FROM chatbot_items ORDER BY orden ASC, created_at ASC");
  return r.rows;
}

async function create(data) {
  validar(data);
  const r = await pool.query(
    `INSERT INTO chatbot_items (pregunta, respuesta_markdown, orden, activo)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [data.pregunta, data.respuesta_markdown, data.orden ?? 0, data.activo ?? true]
  );
  return r.rows[0];
}

async function update(itemId, data) {
  validar(data, { parcial: true });
  await findById(itemId);

  const campos = ["pregunta", "respuesta_markdown", "orden", "activo"];
  const sets = [];
  const values = [];
  let i = 1;
  for (const campo of campos) {
    if (data[campo] === undefined) continue;
    sets.push(`${campo} = $${i}`);
    values.push(data[campo]);
    i += 1;
  }
  if (sets.length === 0) {
    throw new AppError("SCHEMA_INVALID", "No se envió ningún campo para actualizar", 400);
  }
  sets.push("updated_at = now()");
  values.push(itemId);

  const r = await pool.query(
    `UPDATE chatbot_items SET ${sets.join(", ")} WHERE item_id = $${i} RETURNING *`,
    values
  );
  return r.rows[0];
}

async function remove(itemId) {
  await findById(itemId);
  await pool.query("DELETE FROM chatbot_items WHERE item_id = $1", [itemId]);
}

module.exports = { listPublic, listAdmin, findById, create, update, remove };
