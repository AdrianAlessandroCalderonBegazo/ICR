// Crea (o actualiza la contraseña de) el primer usuario ADMIN.
//
// Deliberadamente NO hay ningún usuario ni contraseña hardcodeada en
// db/seed.sql — un hash de contraseña compartido y versionado en el repo
// significaría la misma contraseña de administrador en cada instalación
// de este proyecto. Cada despliegue crea la suya con este script.
//
// Uso:
//   cd backend
//   ADMIN_EMAIL=admin@inversionesicr.com ADMIN_PASSWORD="una-contraseña-real" npm run seed:admin
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { pool } = require("../src/db");

async function run() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const nombre = process.env.ADMIN_NOMBRE || "Administrador";

  if (!email || !password) {
    console.error("Definí ADMIN_EMAIL y ADMIN_PASSWORD como variables de entorno antes de correr este script.");
    console.error('Ejemplo: ADMIN_EMAIL=admin@inversionesicr.com ADMIN_PASSWORD="..." npm run seed:admin');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("ADMIN_PASSWORD debe tener al menos 8 caracteres.");
    process.exit(1);
  }

  const hash = bcrypt.hashSync(password, 10);
  const r = await pool.query(
    `INSERT INTO usuarios (nombre_completo, email, password_hash, rol_codigo)
     VALUES ($1, $2, $3, 'ADMIN')
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
     RETURNING usuario_id, email`,
    [nombre, email, hash]
  );
  console.log(`Usuario ADMIN listo: ${r.rows[0].email} (${r.rows[0].usuario_id})`);
  await pool.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
