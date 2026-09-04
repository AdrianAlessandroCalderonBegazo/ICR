const { pool } = require("../db");
const { AppError } = require("../errors");

const FECHA_RE = /^\d{4}-\d{2}-\d{2}$/;

function validar(data, { parcial = false } = {}) {
  const obligatorios = ["titulo", "mensaje", "fecha_inicio", "fecha_fin"];
  if (!parcial) {
    for (const campo of obligatorios) {
      if (!data[campo] || !String(data[campo]).trim()) {
        throw new AppError("SCHEMA_INVALID", `Falta el campo obligatorio '${campo}'`, 400);
      }
    }
  }
  for (const campo of ["fecha_inicio", "fecha_fin"]) {
    if (data[campo] !== undefined && !FECHA_RE.test(data[campo])) {
      throw new AppError("SCHEMA_INVALID", `'${campo}' debe tener formato YYYY-MM-DD`, 400);
    }
  }
  if (data.fecha_inicio && data.fecha_fin && data.fecha_fin < data.fecha_inicio) {
    throw new AppError("SCHEMA_INVALID", "fecha_fin no puede ser anterior a fecha_inicio", 400);
  }
}

async function findById(bannerId) {
  const r = await pool.query("SELECT * FROM banners WHERE banner_id = $1", [bannerId]);
  if (r.rows.length === 0) {
    throw new AppError("BANNER_NOT_FOUND", `No existe un banner con id '${bannerId}'`, 404);
  }
  return r.rows[0];
}

// Público: solo los banners activos y vigentes hoy (fecha_inicio <= hoy <= fecha_fin).
async function listActivos() {
  const r = await pool.query(
    `SELECT banner_id, titulo, mensaje, enlace_texto, enlace_url
     FROM banners
     WHERE activo = true AND CURRENT_DATE BETWEEN fecha_inicio AND fecha_fin
     ORDER BY fecha_inicio DESC`
  );
  return r.rows;
}

async function listAdmin() {
  const r = await pool.query("SELECT * FROM banners ORDER BY fecha_inicio DESC");
  return r.rows;
}

async function create(data) {
  validar(data);
  const r = await pool.query(
    `INSERT INTO banners (titulo, mensaje, enlace_texto, enlace_url, fecha_inicio, fecha_fin, activo)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      data.titulo, data.mensaje,
      data.enlace_texto || null, data.enlace_url || null,
      data.fecha_inicio, data.fecha_fin, data.activo ?? true,
    ]
  );
  return r.rows[0];
}

async function update(bannerId, data) {
  validar(data, { parcial: true });
  const actual = await findById(bannerId);

  const fechaInicio = data.fecha_inicio ?? actual.fecha_inicio;
  const fechaFin = data.fecha_fin ?? actual.fecha_fin;
  if (fechaFin < fechaInicio) {
    throw new AppError("SCHEMA_INVALID", "fecha_fin no puede ser anterior a fecha_inicio", 400);
  }

  const campos = ["titulo", "mensaje", "enlace_texto", "enlace_url", "fecha_inicio", "fecha_fin", "activo"];
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
  values.push(bannerId);

  const r = await pool.query(
    `UPDATE banners SET ${sets.join(", ")} WHERE banner_id = $${i} RETURNING *`,
    values
  );
  return r.rows[0];
}

async function remove(bannerId) {
  await findById(bannerId);
  await pool.query("DELETE FROM banners WHERE banner_id = $1", [bannerId]);
}

module.exports = { listActivos, listAdmin, findById, create, update, remove };
