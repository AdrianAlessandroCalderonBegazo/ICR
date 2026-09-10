const bcrypt = require("bcryptjs");
const { pool } = require("../db");
const { AppError } = require("../errors");

const ROLES_VALIDOS = ["ADMIN", "EDITOR"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Nunca se selecciona password_hash: la lista admin no debe poder filtrarlo,
// ni siquiera hasheado.
const CAMPOS_PUBLICOS = "usuario_id, nombre_completo, email, rol_codigo, activo, created_at";

function validarNuevoUsuario(data) {
  if (!data.nombre_completo || !String(data.nombre_completo).trim()) {
    throw new AppError("SCHEMA_INVALID", "nombre_completo es obligatorio", 400);
  }
  if (!data.email || !EMAIL_RE.test(data.email)) {
    throw new AppError("SCHEMA_INVALID", "email inválido", 400);
  }
  if (!data.password || data.password.length < 8) {
    throw new AppError("SCHEMA_INVALID", "password debe tener al menos 8 caracteres", 400);
  }
  if (!ROLES_VALIDOS.includes(data.rol_codigo)) {
    throw new AppError("SCHEMA_INVALID", `rol_codigo debe ser uno de: ${ROLES_VALIDOS.join(", ")}`, 400);
  }
}

async function findById(usuarioId) {
  const r = await pool.query(`SELECT ${CAMPOS_PUBLICOS} FROM usuarios WHERE usuario_id = $1`, [usuarioId]);
  if (r.rows.length === 0) {
    throw new AppError("USER_NOT_FOUND", `No existe un usuario con id '${usuarioId}'`, 404);
  }
  return r.rows[0];
}

async function listAdmin() {
  const r = await pool.query(`SELECT ${CAMPOS_PUBLICOS} FROM usuarios ORDER BY created_at ASC`);
  return r.rows;
}

async function create(data) {
  validarNuevoUsuario(data);
  const existing = await pool.query("SELECT 1 FROM usuarios WHERE email = $1", [data.email]);
  if (existing.rows.length > 0) {
    throw new AppError("USER_EMAIL_TAKEN", `Ya existe un usuario con email '${data.email}'`, 409);
  }
  const hash = bcrypt.hashSync(data.password, 10);
  const r = await pool.query(
    `INSERT INTO usuarios (nombre_completo, email, password_hash, rol_codigo, activo)
     VALUES ($1, $2, $3, $4, $5) RETURNING ${CAMPOS_PUBLICOS}`,
    [data.nombre_completo.trim(), data.email, hash, data.rol_codigo, data.activo ?? true]
  );
  return r.rows[0];
}

// No hay que poder desactivarse a sí mismo (te dejaría fuera del panel sin
// forma de revertirlo desde ahí), ni desactivar al último ADMIN activo (el
// sistema se quedaría sin nadie que pueda gestionar usuarios).
async function setActivo(usuarioId, activo, { actorId } = {}) {
  const usuario = await findById(usuarioId);
  if (!activo) {
    if (usuarioId === actorId) {
      throw new AppError("USER_CANNOT_DEACTIVATE_SELF", "No puedes desactivar tu propia cuenta", 400);
    }
    if (usuario.rol_codigo === "ADMIN") {
      const r = await pool.query(
        "SELECT count(*)::int AS total FROM usuarios WHERE rol_codigo = 'ADMIN' AND activo = true AND usuario_id != $1",
        [usuarioId]
      );
      if (r.rows[0].total === 0) {
        throw new AppError("USER_LAST_ADMIN", "No puedes desactivar al único administrador activo", 400);
      }
    }
  }
  const r = await pool.query(
    `UPDATE usuarios SET activo = $1 WHERE usuario_id = $2 RETURNING ${CAMPOS_PUBLICOS}`,
    [activo, usuarioId]
  );
  return r.rows[0];
}

async function setPassword(usuarioId, password) {
  if (!password || password.length < 8) {
    throw new AppError("SCHEMA_INVALID", "password debe tener al menos 8 caracteres", 400);
  }
  await findById(usuarioId);
  const hash = bcrypt.hashSync(password, 10);
  const r = await pool.query(
    `UPDATE usuarios SET password_hash = $1 WHERE usuario_id = $2 RETURNING ${CAMPOS_PUBLICOS}`,
    [hash, usuarioId]
  );
  return r.rows[0];
}

module.exports = { listAdmin, findById, create, setActivo, setPassword, ROLES_VALIDOS };
