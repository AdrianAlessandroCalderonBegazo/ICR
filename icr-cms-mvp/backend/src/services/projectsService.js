const { pool } = require("../db");
const { AppError } = require("../errors");

const SECTORES_VALIDOS = ["mineria", "industria", "hogar", "municipio", "agro", "retail"];

function validarMetricas(metricas) {
  if (!Array.isArray(metricas) || metricas.length < 1 || metricas.length > 4) {
    throw new AppError("SCHEMA_INVALID", "metricas debe ser una lista de 1 a 4 elementos {value, label}", 400);
  }
  for (const m of metricas) {
    if (!m || typeof m.value !== "string" || typeof m.label !== "string" || !m.value.trim() || !m.label.trim()) {
      throw new AppError("SCHEMA_INVALID", "cada métrica necesita 'value' y 'label' como texto no vacío", 400);
    }
  }
}

function validarProyecto(data, { parcial = false } = {}) {
  const campos = ["slug", "sector", "lugar", "titulo", "descripcion", "metricas"];
  if (!parcial) {
    for (const campo of campos) {
      if (data[campo] === undefined) {
        throw new AppError("SCHEMA_INVALID", `Falta el campo obligatorio '${campo}'`, 400);
      }
    }
  }
  if (data.slug !== undefined && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(data.slug)) {
    throw new AppError("SCHEMA_INVALID", "slug solo puede tener minúsculas, números y guiones (ej: mineria-moquegua)", 400);
  }
  if (data.sector !== undefined && !SECTORES_VALIDOS.includes(data.sector)) {
    throw new AppError("SCHEMA_INVALID", `sector debe ser uno de: ${SECTORES_VALIDOS.join(", ")}`, 400);
  }
  if (data.metricas !== undefined) validarMetricas(data.metricas);
}

async function findBySlug(slug) {
  const r = await pool.query("SELECT * FROM proyectos WHERE slug = $1", [slug]);
  if (r.rows.length === 0) {
    throw new AppError("PROJECT_NOT_FOUND", `No existe un proyecto con slug '${slug}'`, 404);
  }
  return r.rows[0];
}

// Público: solo lo publicado, en el orden que definió el editor. Es lo que
// consume el sitio web (icr-frontend-design1).
async function listPublic() {
  const r = await pool.query(
    "SELECT slug, sector, lugar, titulo, descripcion, metricas, placeholder FROM proyectos WHERE publicado = true ORDER BY orden ASC, created_at ASC"
  );
  return r.rows;
}

// Admin: todo, incluyendo lo no publicado, para gestionarlo desde el panel.
async function listAdmin() {
  const r = await pool.query("SELECT * FROM proyectos ORDER BY orden ASC, created_at ASC");
  return r.rows;
}

async function create(data) {
  validarProyecto(data);
  const existing = await pool.query("SELECT 1 FROM proyectos WHERE slug = $1", [data.slug]);
  if (existing.rows.length > 0) {
    throw new AppError("PROJECT_SLUG_TAKEN", `Ya existe un proyecto con slug '${data.slug}'`, 409);
  }
  const r = await pool.query(
    `INSERT INTO proyectos (slug, sector, lugar, titulo, descripcion, metricas, placeholder, publicado, orden)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      data.slug,
      data.sector,
      data.lugar,
      data.titulo,
      data.descripcion,
      JSON.stringify(data.metricas),
      data.placeholder ?? true,
      data.publicado ?? true,
      data.orden ?? 0,
    ]
  );
  return r.rows[0];
}

async function update(slug, data) {
  validarProyecto(data, { parcial: true });
  await findBySlug(slug);

  if (data.slug !== undefined && data.slug !== slug) {
    const existing = await pool.query("SELECT 1 FROM proyectos WHERE slug = $1", [data.slug]);
    if (existing.rows.length > 0) {
      throw new AppError("PROJECT_SLUG_TAKEN", `Ya existe un proyecto con slug '${data.slug}'`, 409);
    }
  }

  const campos = ["slug", "sector", "lugar", "titulo", "descripcion", "metricas", "placeholder", "publicado", "orden"];
  const sets = [];
  const values = [];
  let i = 1;
  for (const campo of campos) {
    if (data[campo] === undefined) continue;
    sets.push(`${campo} = $${i}`);
    values.push(campo === "metricas" ? JSON.stringify(data[campo]) : data[campo]);
    i += 1;
  }
  if (sets.length === 0) {
    throw new AppError("SCHEMA_INVALID", "No se envió ningún campo para actualizar", 400);
  }
  sets.push(`updated_at = now()`);
  values.push(slug);

  const r = await pool.query(
    `UPDATE proyectos SET ${sets.join(", ")} WHERE slug = $${i} RETURNING *`,
    values
  );
  return r.rows[0];
}

async function remove(slug) {
  await findBySlug(slug);
  await pool.query("DELETE FROM proyectos WHERE slug = $1", [slug]);
}

module.exports = { listPublic, listAdmin, findBySlug, create, update, remove, SECTORES_VALIDOS };
