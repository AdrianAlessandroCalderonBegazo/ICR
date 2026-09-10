const { pool } = require("../db");
const { AppError } = require("../errors");

const CAMPOS_TEXTO = ["historia_p1", "historia_p2", "historia_p3", "mision", "vision"];

function validarTrayectoria(trayectoria) {
  if (!Array.isArray(trayectoria) || trayectoria.length < 1) {
    throw new AppError("SCHEMA_INVALID", "trayectoria debe ser una lista con al menos 1 hito {anio, titulo, descripcion}", 400);
  }
  for (const hito of trayectoria) {
    if (
      !hito ||
      typeof hito.anio !== "string" || !hito.anio.trim() ||
      typeof hito.titulo !== "string" || !hito.titulo.trim() ||
      typeof hito.descripcion !== "string" || !hito.descripcion.trim()
    ) {
      throw new AppError("SCHEMA_INVALID", "cada hito de trayectoria necesita 'anio', 'titulo' y 'descripcion' como texto no vacío", 400);
    }
  }
}

function validar(data) {
  for (const campo of CAMPOS_TEXTO) {
    if (data[campo] !== undefined && !String(data[campo]).trim()) {
      throw new AppError("SCHEMA_INVALID", `'${campo}' no puede estar vacío`, 400);
    }
  }
  if (data.trayectoria !== undefined) validarTrayectoria(data.trayectoria);
}

// Siempre hay una sola fila (mismo patrón que portada): si no existe (base
// recién creada sin seed.sql), se crea con los valores por defecto en vez de
// fallar.
async function get() {
  const r = await pool.query("SELECT * FROM nosotros ORDER BY updated_at DESC LIMIT 1");
  if (r.rows.length > 0) return r.rows[0];
  const created = await pool.query("INSERT INTO nosotros DEFAULT VALUES RETURNING *");
  return created.rows[0];
}

async function update(data) {
  validar(data);
  const actual = await get();

  const campos = [...CAMPOS_TEXTO, "trayectoria"];
  const sets = [];
  const values = [];
  let i = 1;
  for (const campo of campos) {
    if (data[campo] === undefined) continue;
    sets.push(`${campo} = $${i}`);
    values.push(campo === "trayectoria" ? JSON.stringify(data[campo]) : data[campo]);
    i += 1;
  }
  if (sets.length === 0) {
    throw new AppError("SCHEMA_INVALID", "No se envió ningún campo para actualizar", 400);
  }
  sets.push("updated_at = now()");
  values.push(actual.nosotros_id);

  const r = await pool.query(
    `UPDATE nosotros SET ${sets.join(", ")} WHERE nosotros_id = $${i} RETURNING *`,
    values
  );
  return r.rows[0];
}

module.exports = { get, update };
