const { Pool, types } = require("pg");

// Por defecto, node-postgres convierte las columnas DATE (OID 1082) a
// objetos Date de JavaScript en la zona horaria local del proceso — con
// columnas que son solo "año-mes-día" (fecha_inicio/fecha_fin de banners),
// eso arrastra un desfase de zona horaria y hace que comparar una fecha
// leída de la base contra un string "YYYY-MM-DD" recién recibido de la API
// compare cosas de tipos distintos. Se desactiva ese parseo: las columnas
// DATE llegan tal cual el texto que devuelve Postgres.
types.setTypeParser(1082, (value) => value);

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "postgres",
  database: process.env.PGDATABASE || "icr_cms",
});

pool.on("error", (err) => {
  console.error("Error inesperado en el pool de PostgreSQL", err);
});

module.exports = { pool };
