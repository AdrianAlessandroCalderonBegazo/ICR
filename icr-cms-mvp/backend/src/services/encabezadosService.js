const { pool } = require("../db");
const { AppError } = require("../errors");

const CAMPOS = [
  "soluciones_eyebrow", "soluciones_titulo", "soluciones_texto",
  "nosotros_eyebrow", "nosotros_titulo", "nosotros_texto",
  "proyectos_eyebrow", "proyectos_titulo", "proyectos_texto",
  "calculadora_eyebrow", "calculadora_titulo", "calculadora_texto",
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

// Siempre hay una sola fila (mismo patrón que portada): si no existe (base
// recién creada sin seed.sql), se crea con los valores por defecto en vez de
// fallar.
async function get() {
  const r = await pool.query("SELECT * FROM encabezados_paginas ORDER BY updated_at DESC LIMIT 1");
  if (r.rows.length > 0) return r.rows[0];
  const created = await pool.query("INSERT INTO encabezados_paginas DEFAULT VALUES RETURNING *");
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
  values.push(actual.encabezado_id);

  const r = await pool.query(
    `UPDATE encabezados_paginas SET ${sets.join(", ")} WHERE encabezado_id = $${i} RETURNING *`,
    values
  );
  return r.rows[0];
}

module.exports = { get, update };
