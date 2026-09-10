const { pool } = require("../db");
const { AppError } = require("../errors");

const GRUPOS_VALIDOS = ["energia-solar", "respaldo-energetico", "infraestructura"];

function validarCaracteristicas(caracteristicas) {
  if (!Array.isArray(caracteristicas) || caracteristicas.length < 1) {
    throw new AppError("SCHEMA_INVALID", "caracteristicas debe ser una lista con al menos 1 elemento de texto", 400);
  }
  for (const c of caracteristicas) {
    if (typeof c !== "string" || !c.trim()) {
      throw new AppError("SCHEMA_INVALID", "cada característica debe ser texto no vacío", 400);
    }
  }
}

function validar(data, { parcial = false } = {}) {
  const campos = ["grupo", "titulo", "descripcion", "caracteristicas"];
  if (!parcial) {
    for (const campo of campos) {
      if (data[campo] === undefined) {
        throw new AppError("SCHEMA_INVALID", `Falta el campo obligatorio '${campo}'`, 400);
      }
    }
  }
  if (data.grupo !== undefined && !GRUPOS_VALIDOS.includes(data.grupo)) {
    throw new AppError("SCHEMA_INVALID", `grupo debe ser uno de: ${GRUPOS_VALIDOS.join(", ")}`, 400);
  }
  if (data.titulo !== undefined && !String(data.titulo).trim()) {
    throw new AppError("SCHEMA_INVALID", "titulo no puede estar vacío", 400);
  }
  if (data.descripcion !== undefined && !String(data.descripcion).trim()) {
    throw new AppError("SCHEMA_INVALID", "descripcion no puede estar vacío", 400);
  }
  if (data.caracteristicas !== undefined) validarCaracteristicas(data.caracteristicas);
}

async function findById(productoId) {
  const r = await pool.query("SELECT * FROM productos WHERE producto_id = $1", [productoId]);
  if (r.rows.length === 0) {
    throw new AppError("PRODUCT_NOT_FOUND", `No existe un producto con id '${productoId}'`, 404);
  }
  return r.rows[0];
}

// Público: solo lo publicado, agrupado en el orden que definió el editor.
async function listPublic() {
  const r = await pool.query(
    "SELECT producto_id, grupo, titulo, descripcion, caracteristicas FROM productos WHERE publicado = true ORDER BY grupo ASC, orden ASC, created_at ASC"
  );
  return r.rows;
}

async function listAdmin() {
  const r = await pool.query("SELECT * FROM productos ORDER BY grupo ASC, orden ASC, created_at ASC");
  return r.rows;
}

async function create(data) {
  validar(data);
  const r = await pool.query(
    `INSERT INTO productos (grupo, titulo, descripcion, caracteristicas, publicado, orden)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      data.grupo,
      data.titulo,
      data.descripcion,
      JSON.stringify(data.caracteristicas),
      data.publicado ?? true,
      data.orden ?? 0,
    ]
  );
  return r.rows[0];
}

async function update(productoId, data) {
  validar(data, { parcial: true });
  await findById(productoId);

  const campos = ["grupo", "titulo", "descripcion", "caracteristicas", "publicado", "orden"];
  const sets = [];
  const values = [];
  let i = 1;
  for (const campo of campos) {
    if (data[campo] === undefined) continue;
    sets.push(`${campo} = $${i}`);
    values.push(campo === "caracteristicas" ? JSON.stringify(data[campo]) : data[campo]);
    i += 1;
  }
  if (sets.length === 0) {
    throw new AppError("SCHEMA_INVALID", "No se envió ningún campo para actualizar", 400);
  }
  sets.push("updated_at = now()");
  values.push(productoId);

  const r = await pool.query(
    `UPDATE productos SET ${sets.join(", ")} WHERE producto_id = $${i} RETURNING *`,
    values
  );
  return r.rows[0];
}

async function remove(productoId) {
  await findById(productoId);
  await pool.query("DELETE FROM productos WHERE producto_id = $1", [productoId]);
}

module.exports = { listPublic, listAdmin, findById, create, update, remove, GRUPOS_VALIDOS };
