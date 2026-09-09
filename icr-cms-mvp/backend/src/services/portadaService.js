const { pool } = require("../db");
const { AppError } = require("../errors");

const CAMPOS = [
  "eyebrow", "titulo_linea1", "titulo_linea2", "titulo_destacado", "descripcion",
  "cta_primario_texto", "cta_primario_link", "cta_secundario_texto", "cta_secundario_link",
];

function validar(data) {
  for (const campo of CAMPOS) {
    if (data[campo] !== undefined && typeof data[campo] !== "string") {
      throw new AppError("SCHEMA_INVALID", `'${campo}' debe ser texto`, 400);
    }
    if (data[campo] !== undefined && !data[campo].trim()) {
      throw new AppError("SCHEMA_INVALID", `'${campo}' no puede estar vacío`, 400);
    }
  }
}

// Siempre hay una sola fila. Si por algún motivo no existe (base recién
// creada sin seed.sql), se crea una con los valores por defecto de la
// columna en vez de fallar.
async function get() {
  const r = await pool.query("SELECT * FROM portada ORDER BY updated_at DESC LIMIT 1");
  if (r.rows.length > 0) return r.rows[0];
  const created = await pool.query("INSERT INTO portada DEFAULT VALUES RETURNING *");
  return created.rows[0];
}

async function update(data) {
  validar(data);
  const actual = await get();

  const sets = [];
  const values = [];
  let i = 1;
  for (const campo of CAMPOS) {
    if (data[campo] === undefined) continue;
    sets.push(`${campo} = $${i}`);
    values.push(data[campo]);
    i += 1;
  }
  if (sets.length === 0) {
    throw new AppError("SCHEMA_INVALID", "No se envió ningún campo para actualizar", 400);
  }
  sets.push("updated_at = now()");
  values.push(actual.portada_id);

  const r = await pool.query(
    `UPDATE portada SET ${sets.join(", ")} WHERE portada_id = $${i} RETURNING *`,
    values
  );
  return r.rows[0];
}

// Las imágenes (fondo del hero, logo) se suben y guardan en un paso propio
// (ver rutas /admin/portada/imagen y /admin/portada/logo), no como parte del
// payload JSON normal de update(). "campo" nunca viene del cliente: cada
// función pública fija el nombre de columna, así que no hay riesgo de
// inyectar un nombre de columna arbitrario en el SQL interpolado.
async function setCampoImagen(campo, url) {
  const actual = await get();
  const r = await pool.query(
    `UPDATE portada SET ${campo} = $1, updated_at = now() WHERE portada_id = $2 RETURNING *`,
    [url, actual.portada_id]
  );
  return r.rows[0];
}

async function setImagen(url) {
  return setCampoImagen("imagen_url", url);
}

async function clearImagen() {
  return setCampoImagen("imagen_url", null);
}

async function setLogo(url) {
  return setCampoImagen("logo_url", url);
}

async function clearLogo() {
  return setCampoImagen("logo_url", null);
}

module.exports = { get, update, setImagen, clearImagen, setLogo, clearLogo };
